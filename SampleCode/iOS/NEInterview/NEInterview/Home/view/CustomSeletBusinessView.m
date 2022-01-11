//
//  CustomSeletBusinessView.m
//  NEInterview
//
//  Created by 郭园园 on 2021/1/27.
//

#import "CustomSeletBusinessView.h"

@implementation CustomSeletBusinessView
- (instancetype)init
{
    self = [super init];
    if (self) {
        [self setupUI];
    }
    return self;
}
- (void)setupUI {
    self.titleLabel.text = @"办理业务";
    [self addSubview:self.selectBtn];
    [self.selectBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.titleLabel.mas_right).offset(10);
        make.top.bottom.mas_equalTo(0);
    }];
    [self addSubview:self.arrowImageView];
    [self.arrowImageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(self.selectBtn.mas_right).offset(5);
        make.right.mas_equalTo(-20);
        make.size.mas_equalTo(CGSizeMake(16, 16));
        make.centerY.mas_equalTo(0);
    }];
}

- (UIButton *)selectBtn {
    if (!_selectBtn) {
        _selectBtn = [UIButton buttonWithType:UIButtonTypeCustom];
        [_selectBtn setTitle:@"请选择" forState:UIControlStateNormal];
        _selectBtn.titleLabel.font = [UIFont systemFontOfSize:15];
//        _selectBtn.titleLabel.textAlignment = NSTextAlignmentLeft;
        [_selectBtn setTitleColor:[UIColor darkTextColor] forState:UIControlStateNormal];
    }
    return _selectBtn;
}
- (UIImageView *)arrowImageView {
    if (!_arrowImageView) {
        _arrowImageView = [[UIImageView alloc] init];
        _arrowImageView.image = [UIImage imageNamed:@"rightArrow"];
    }
    return _arrowImageView;
}
@end
