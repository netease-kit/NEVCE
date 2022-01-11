//
//  NEAIMessageCache.h
//  AILayout
//
//  Created by Ginger on 2021/9/28.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
@class NEAIMessageCache;

NS_ASSUME_NONNULL_BEGIN

@interface NEAIMessage : NSObject

@property (nonatomic, assign) bool isSend;
@property (nonatomic, copy) NSString *text;
@property (nonatomic, copy) NSString *time;

// 对cell高度的计算放在这里其实不合适，但简单的界面不再去创建layout之类的对象
@property (nonatomic, assign) CGFloat cellHeight;

@end

@protocol NEAIMessageCacheDelegate <NSObject>

- (void)cache:(NEAIMessageCache *)cache didAddMessage:(NEAIMessage *)message;

- (void)cache:(NEAIMessageCache *)cache didRemoveMessage:(NEAIMessage *)message;

@end

@interface NEAIMessageCache : NSObject

@property (nonatomic, weak) id<NEAIMessageCacheDelegate> delegate;
@property (nonatomic, strong) NSMutableArray<NEAIMessage *> *messageList;

+ (NEAIMessageCache *)sharedInstance;

- (void)addMessage:(NEAIMessage *)message;

- (void)removeMessage:(NEAIMessage *)message;

- (void)clear;

@end

NS_ASSUME_NONNULL_END
