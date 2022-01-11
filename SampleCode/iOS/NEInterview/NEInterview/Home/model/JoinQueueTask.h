//
//  JoinQueueTask.h
//  NEInterview
//
//  Created by 郭园园 on 2021/2/1.
//

#import "NETask.h"
#import "VisitorInfo.h"

NS_ASSUME_NONNULL_BEGIN

@interface JoinQueueTask : NETask
/// 业务类别
@property (nonatomic,strong)NSArray *req_categoryList;
@property (nonatomic,strong)VisitorInfo *req_visitorInfo;
/// 特殊属性，设置重新排队是插入队尾还是队首 不同属性权重不一样，rearrange：重排，top：置顶
@property (nonatomic,strong)NSString *req_specialCode;
@end

NS_ASSUME_NONNULL_END
