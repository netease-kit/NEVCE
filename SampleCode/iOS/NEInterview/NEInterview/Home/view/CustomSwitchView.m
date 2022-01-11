//
//  CustomSwitchView.m
//  NEInterview
//
//  Created by 郭园园 on 2021/1/25.
//

#import "CustomSwitchView.h"

@implementation CustomSwitchView

- (instancetype)init
{
    self = [super init];
    if (self) {
        [self addSubview:self.switchButton];
        [self.switchButton mas_makeConstraints:^(MASConstraintMaker *make) {
            make.width.mas_equalTo(40);
            make.right.mas_equalTo(-20);
            make.centerY.mas_equalTo(0);
        }];
    }
    return self;
}

- (UISwitch *)switchButton {
    if (!_switchButton) {
        _switchButton = [[UISwitch alloc] init];
    }
    return _switchButton;
    
}
@end
