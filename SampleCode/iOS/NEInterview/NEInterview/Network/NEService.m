//
//  NEService.m
//  NEDemo
//
//  Created by Think on 2020/8/26.
//  Copyright © 2020 Netease. All rights reserved.
//

#import "NEService.h"
#import <YYModel/NSObject+YYModel.h>
#import <NELog/NELog.h>

@implementation NEService

+ (instancetype)shared
{
    static id instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[[self class] alloc] init];
    });
    return instance;
}

- (void)runTask:(id<NEServiceTask>)task completion:(NERequestHandler)completion
{
    NSURLRequest *request = [task taskRequest];
    NELogInfo(@"Request:%@", request.URL.absoluteString);
    NSURLSessionTask *sessionTask =
    [[NSURLSession sharedSession] dataTaskWithRequest:request
                                    completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable connectionError) {
                                        id jsonData = nil;
                                        NSError *error = nil;
                                        
                                        if (connectionError == nil && [response isKindOfClass:[NSHTTPURLResponse class]]) {
                                            NSInteger status = [(NSHTTPURLResponse *)response statusCode];
                                            if (status == 200 && data) {
                                                jsonData = [NSJSONSerialization JSONObjectWithData:data
                                                                                           options:0
                                                                                             error:nil];
                                                if ([jsonData isKindOfClass:[NSDictionary class]]) {
                                                    NSDictionary *dict = jsonData;
                                                    if ([dict objectForKey:@"code"]) {
                                                        long code = [[dict objectForKey:@"code"] longValue];
                                                        NSString *msg = [dict objectForKey:@"msg"]?:@"";
                                                        if (code != 200) {
                                                            error = [NSError errorWithDomain:@"NTESErrorBusinessDomain"
                                                                                        code:code
                                                                                    userInfo:@{NSLocalizedDescriptionKey:msg}];
                                                        }
                                                    }
                                                }
                                            }else {
                                                error = connectionError;
                                            }
                                        }
                                        else {
                                            error = connectionError;
                                        }
        dispatch_main_async_safe(^{
            if (completion) {
                id result = [jsonData objectForKey:@"ret"];
                if ([result isKindOfClass:[NSDictionary class]]) {
                    [(NETask *)task yy_modelSetWithDictionary:result];
                }else if ([result isKindOfClass:[NSArray class]]){
                    [(NETask *)task yy_modelSetWithDictionary:jsonData];
                }
                completion(jsonData,task,error);
                NELogInfo(@"Response:%@ \n error:%@ \n jsonData:%@",request.URL.absoluteString,error,jsonData);

            }
        })
                                    
    }];
    [sessionTask resume];
}



@end
