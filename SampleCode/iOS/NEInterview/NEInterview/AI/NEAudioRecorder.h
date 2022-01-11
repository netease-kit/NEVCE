//
//  NEAudioRecorder.h
//  WebViewDemo
//
//  Created by Ginger on 2021/9/27.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NEAudioRecorder : NSObject

@property (nonatomic, assign, readonly) bool isRecording;

- (void)startRecord;

- (NSString *)stopRecord;

@end

NS_ASSUME_NONNULL_END
