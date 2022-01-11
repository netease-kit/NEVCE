//
//  NETask.h
//  NEDemo
//
//  Created by Think on 2020/8/26.
//  Copyright © 2020 Netease. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "NEServiceTask.h"
#import "NETask.h"
#import "Config.h"

NS_ASSUME_NONNULL_BEGIN

// 请求闭包
typedef void(^NERequestHandler)(NSDictionary * _Nullable data,id _Nullable task, NSError * _Nullable error);

@interface NETask : NSObject<NEServiceTask>
@property(strong,nonatomic)NSString *URLString;

+ (instancetype)task;
+ (instancetype)taskWithSubURL:(NSString * __nullable)subURL;
+ (instancetype)taskWithURLString:(NSString *)urlString;
- (void)postWithCompletion:(NERequestHandler)completion;
- (NSDictionary *)getProperties;

@end

NS_ASSUME_NONNULL_END
