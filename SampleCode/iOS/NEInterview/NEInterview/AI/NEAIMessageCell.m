//
//  NEAIMessageCell.m
//  AILayout
//
//  Created by Ginger on 2021/9/28.
//

#import "NEAIMessageCell.h"
#import "Masonry.h"

@interface NEAIMessageCell ()

@property (nonatomic, strong) NEAIMessage *message;
@property (nonatomic, assign) CGSize bubbleViewSize;
@property (nonatomic, strong) UIView *bubbleView;
@property (nonatomic, strong) UILabel *contentLabel;
@property (nonatomic, strong) UIImageView *icon;

@end

@implementation NEAIMessageCell

- (void)configWithMessage:(NEAIMessage *)message {
    self.message = message;
    self.bubbleViewSize = [self calculateBubbleViewSize:message.text];
    if (!_bubbleView) {
        _bubbleView = [[UIView alloc] init];
        _bubbleView.layer.cornerRadius = 8;
        [self addSubview:_bubbleView];
    }
    _bubbleView.backgroundColor = message.isSend ? [UIColor colorWithRed:0.8 green:0.884 blue:1 alpha:1] : [UIColor colorWithRed:0.95 green:0.954 blue:0.96 alpha:1];
    
    if (!_contentLabel) {
        _contentLabel = [[UILabel alloc] init];
        _contentLabel.numberOfLines = 0;
        _contentLabel.font = [UIFont systemFontOfSize:14];
        [self.bubbleView addSubview:_contentLabel];
    }
    _contentLabel.text = message.text;
    
    if (!_icon) {
        _icon = [[UIImageView alloc] init];
        _icon.layer.cornerRadius = 20;
        _icon.layer.masksToBounds = true;
        [self addSubview:_icon];
    }
    _icon.image = message.isSend ? [UIImage imageNamed:@"self_avatar"] : [UIImage imageNamed:@"ai_avatar"];
}

- (CGSize)calculateBubbleViewSize:(NSString *)text {
    // 实际fontSize14，预留一些
    NSDictionary *attributes = @{NSFontAttributeName : [UIFont systemFontOfSize:15]};
    CGSize contetSize = [text boundingRectWithSize:CGSizeMake(250, MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:attributes context:nil].size;
    // 左右边距10，上下边距12
    return CGSizeMake(contetSize.width + 24, contetSize.height + 20);
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    CGFloat bubble_x = self.message.isSend ? self.frame.size.width-50-self.bubbleViewSize.width : 50;
    CGRect bubbleFrame = CGRectMake(bubble_x, 10, self.bubbleViewSize.width, self.bubbleViewSize.height);
    _bubbleView.frame = bubbleFrame;
    
    CGFloat icon_x = self.message.isSend ? self.frame.size.width-5-40 : 5;
    CGRect iconFrame = CGRectMake(icon_x, 10, 40, 40);
    _icon.frame = iconFrame;
    
    [_contentLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(10);
        make.bottom.mas_equalTo(-10);
        make.leading.mas_equalTo(12);
        make.trailing.mas_equalTo(-12);
    }];
}

@end
