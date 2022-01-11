//
//  CustomInputView.m
//  NEInterview
//
//  Created by 郭园园 on 2021/1/25.
//

#import "CustomInputView.h"

@implementation CustomInputView
- (instancetype)init
{
    self = [super init];
    if (self) {
        [self addSubview:self.textField];
        [self.textField mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.mas_equalTo(self.titleLabel.mas_right).offset(5);
            make.right.mas_equalTo(-20);
            make.top.bottom.mas_equalTo(0);
        }];
    }
    return self;
}
- (UITextField *)textField {
    if (!_textField) {
        _textField = [[UITextField alloc] init];
        _textField.placeholder = @"请输入";
        _textField.clearButtonMode = UITextFieldViewModeWhileEditing;
    }
    return _textField;
}

@end
