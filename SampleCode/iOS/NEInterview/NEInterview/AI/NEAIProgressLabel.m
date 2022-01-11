//
//  NEAIProgressLabel.m
//  AILayout
//
//  Created by Ginger on 2021/9/28.
//

#import "NEAIProgressLabel.h"

@interface NEAIProgressLabel ()
{
    bool _isInProgress;
}
@property (nonatomic, strong) UILabel *textLabel;
@property (nonatomic, strong) UISlider *progressSlider;
@property (nonatomic, strong) NSTimer *timer;

@end

@implementation NEAIProgressLabel

- (instancetype)init {
    if ([super init]) {
        [self addSubview:self.textLabel];
        [self addSubview:self.progressSlider];
        self.layer.cornerRadius = 4;
        self.layer.masksToBounds = true;
        self.backgroundColor = [UIColor colorWithRed:0.968 green:0.968 blue:0.968 alpha:1];
        self.progressText = @"检测中，请正对镜头，在3秒内回答";
        self.defaultText = @"请在出现进度条后再回答";
        self.progressTime = 3;
    }
    return self;
}

- (void)startProgress {
    _isInProgress = true;
    self.textLabel.text = self.progressText;
    [_timer invalidate];
    dispatch_async(dispatch_get_global_queue(0, 0), ^{
        self->_timer = [NSTimer scheduledTimerWithTimeInterval:0.1 repeats:true block:^(NSTimer * _Nonnull timer) {
            if (!self->_isInProgress) {
                return;
            }
            dispatch_async(dispatch_get_main_queue(), ^{
                self.progressSlider.value += 0.1/self.progressTime;
                if (self.progressSlider.value >= 1) {
                    [self stopProgress];
                }
            });
        }];
        [[NSRunLoop currentRunLoop] run];
    });
}

- (void)stopProgress {
    _isInProgress = false;
    self.progressSlider.value = 0;
    self.textLabel.text = self.defaultText;
    [_timer invalidate];
    if (self.delegate && [self.delegate respondsToSelector:@selector(progerssLabelDidStop:)]) {
        [self.delegate progerssLabelDidStop:self];
    }
}

- (UILabel *)textLabel {
    if (!_textLabel) {
        _textLabel = [[UILabel alloc] init];
        _textLabel.textColor = [UIColor colorWithRed:0.4 green:0.4 blue:0.4 alpha:1];
        _textLabel.font = [UIFont fontWithName:@"PingFangSC-Regular" size:14];
        _textLabel.textAlignment = NSTextAlignmentCenter;
    }
    return _textLabel;
}

- (UISlider *)progressSlider {
    if (!_progressSlider) {
        _progressSlider = [[UISlider alloc] init];
        _progressSlider.minimumTrackTintColor = [UIColor colorWithRed:0.2 green:0.494 blue:1 alpha:1];
        _progressSlider.maximumTrackTintColor = [UIColor colorWithRed:0.917 green:0.937 blue:0.976 alpha:1];
        _progressSlider.userInteractionEnabled = false;
        _progressSlider.thumbTintColor = [UIColor clearColor];
        _progressSlider.value = 0;
    }
    return _progressSlider;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    self.textLabel.text = _isInProgress ? self.progressText : self.defaultText;
    // 上下边距12
    self.textLabel.frame = CGRectMake(0, 12, self.frame.size.width, self.frame.size.height-24);
    self.progressSlider.frame = CGRectMake(-2, 0, self.frame.size.width+4, 4);
}

@end
