//
//  Config.h
//  NEMeetingDemo
//
//  Copyright (c) 2014-2020 NetEase, Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <NEVCESDK/NEVCESDK.h>

extern NSString * _Nonnull const kAppKey;
extern NSString * _Nonnull const kIMAppKey;

extern NSString * _Nonnull const kApiHost;


NS_ASSUME_NONNULL_BEGIN

@interface Config : NSObject

+ (NEVCESceneType)scene;

@end

NS_ASSUME_NONNULL_END
