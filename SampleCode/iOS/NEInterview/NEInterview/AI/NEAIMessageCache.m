//
//  NEAIMessageCache.m
//  AILayout
//
//  Created by Ginger on 2021/9/28.
//

#import "NEAIMessageCache.h"

@implementation NEAIMessage

- (void)setText:(NSString *)text {
    _text = text;
    self.cellHeight = [self calculateCellHeight];
}

- (CGFloat)calculateCellHeight {
    // 实际fontSize14，预留一些
    NSDictionary *attributes = @{NSFontAttributeName : [UIFont systemFontOfSize:15]};
    CGSize contetSize = [self.text boundingRectWithSize:CGSizeMake(269, MAXFLOAT) options:NSStringDrawingUsesLineFragmentOrigin attributes:attributes context:nil].size;
    // 上下各留10+10边距
    return contetSize.height + 40;
}

@end

@implementation NEAIMessageCache

+ (NEAIMessageCache *)sharedInstance {
    static NEAIMessageCache *instance = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        instance = [[NEAIMessageCache alloc] init];
        instance.messageList = [[NSMutableArray alloc] init];
    });
    return instance;
}

- (void)addMessage:(NEAIMessage *)message {
    if (!message.text.length) {
        return;
    }
    [_messageList addObject:message];
    if (self.delegate && [self.delegate respondsToSelector:@selector(cache:didAddMessage:)]) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.delegate cache:self didAddMessage:message];
        });
    }
}

- (void)removeMessage:(NEAIMessage *)message {
    [_messageList removeObject:message];
    if (self.delegate && [self.delegate respondsToSelector:@selector(cache:didRemoveMessage:)]) {
        dispatch_async(dispatch_get_main_queue(), ^{
            [self.delegate cache:self didRemoveMessage:message];
        });
    }
}

- (void)clear {
    [_messageList removeAllObjects];
}

@end
