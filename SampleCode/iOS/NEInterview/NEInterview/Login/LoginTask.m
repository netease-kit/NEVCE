//
//  LoginTask.m
//  NEInterview
//
//  Created by 郭园园 on 2021/1/31.
//

#import "LoginTask.h"
#import "Config.h"
#import <NELog/NELog.h>

@implementation LoginTask
- (NSURLRequest *)taskRequest
{
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:self.URLString]
                                                                cachePolicy:NSURLRequestUseProtocolCachePolicy
                                                            timeoutInterval:10];
    // 请求头
    [request setHTTPMethod:@"GET"];
//    [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
//    [request addValue:@"application/json" forHTTPHeaderField:@"Accept"];
    [request addValue:@"2" forHTTPHeaderField:@"clientType"];
    [request addValue:@"1.5.0" forHTTPHeaderField:@"meetingSdkVersion"];
    NSString *deviceID = [UIDevice currentDevice].identifierForVendor.UUIDString;
//    NSLog(@"deviceID:%@",deviceID);
    [request addValue:deviceID forHTTPHeaderField:@"deviceId"];
    [request addValue:kAppKey forHTTPHeaderField:@"appKey"];

    NSDictionary *parameterDic = [self getProperties];
    NSError *error;
    NELogInfo(@"parameterDic:\n %@",parameterDic);
    if (!parameterDic || !parameterDic.allKeys.count) {
        return request;
    }
    NSData *data = [NSJSONSerialization dataWithJSONObject:parameterDic options:NSJSONWritingPrettyPrinted error:&error];
    if (error) {
        return request;
    }
    [request setHTTPBody:data];
    return request;
}
@end
