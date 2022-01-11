//
//  NEAIMessageCell.h
//  AILayout
//
//  Created by Ginger on 2021/9/28.
//

#import <UIKit/UIKit.h>
#import "NEAIMessageCache.h"

NS_ASSUME_NONNULL_BEGIN

@interface NEAIMessageCell : UITableViewCell

- (void)configWithMessage:(NEAIMessage *)message;

@end

NS_ASSUME_NONNULL_END
