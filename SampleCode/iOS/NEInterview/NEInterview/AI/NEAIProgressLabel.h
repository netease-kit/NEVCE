//
//  NEAIProgressLabel.h
//  AILayout
//
//  Created by Ginger on 2021/9/28.
//

#import <UIKit/UIKit.h>
@class NEAIProgressLabel;

NS_ASSUME_NONNULL_BEGIN

@protocol NEAIProgressLabelDelegate <NSObject>

- (void)progerssLabelDidStop:(NEAIProgressLabel *)label;

@end

@interface NEAIProgressLabel : UIView

@property (nonatomic, copy) NSString *defaultText;
@property (nonatomic, copy) NSString *progressText;
@property (nonatomic, assign) int progressTime;
@property (nonatomic, assign, readonly) bool isInProgress;

@property (nonatomic, weak) id<NEAIProgressLabelDelegate> delegate;

- (void)startProgress;
- (void)stopProgress;


@end

NS_ASSUME_NONNULL_END
