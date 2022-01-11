//
//  NEAudioRecorder.m
//  WebViewDemo
//
//  Created by Ginger on 2021/9/27.
//

#import "NEAudioRecorder.h"
#import <AVFoundation/AVFoundation.h>

@interface NEAudioRecorder ()
{
    bool _isRecording;
}

@property (nonatomic, strong) AVAudioRecorder *audioRecorder;
@property (nonatomic, copy) NSString *filePath;

@end

@implementation NEAudioRecorder

- (void)startRecord {
    if (self.audioRecorder && self.audioRecorder.isRecording) {
        [self stopRecord];
    }
    NSString *audioPath = [[NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) lastObject] stringByAppendingPathComponent:@"audio"];
    [self createPath:audioPath];
    self.filePath = [audioPath stringByAppendingPathComponent:[NSString stringWithFormat:@"%@.wav", [NSUUID UUID]]];
    NSURL *url = [NSURL URLWithString:self.filePath];
    NSDictionary *configDic = @{
        // 编码格式
        AVFormatIDKey:@(kAudioFormatLinearPCM),
        // 采样率
        AVSampleRateKey:@(16000),
        // 通道数
        AVNumberOfChannelsKey:@(2),
        // 录音质量
        AVEncoderAudioQualityKey:@(AVAudioQualityMin)
    };
    self.audioRecorder = [[AVAudioRecorder alloc] initWithURL:url settings:configDic error:nil];
    [self.audioRecorder record];
    _isRecording = true;
}

- (NSString *)stopRecord {
    [self.audioRecorder stop];
    self.audioRecorder = nil;
    _isRecording = false;
    return self.filePath;
}

- (bool)isRecording {
    if (!self.audioRecorder) {
        return false;
    } else {
        return _isRecording;
    }
}

- (BOOL)createPath:(NSString*)pFold {
    BOOL isDir = NO;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    BOOL existed = [fileManager fileExistsAtPath:pFold isDirectory:&isDir];
    if ( !(isDir == YES && existed == YES) )
    {
        return [fileManager createDirectoryAtPath:pFold withIntermediateDirectories:YES attributes:nil error:nil];
    }
    return YES;
}

@end
