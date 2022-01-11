//
//  QueryQueueTask.h
//  NEInterview
//
//  Created by 郭园园 on 2021/2/1.
//

#import "NETask.h"

NS_ASSUME_NONNULL_BEGIN

@interface QueryQueueTask : NETask
/// 分钟
@property (nonatomic,assign)NSInteger expectedWaitTimeMinutes;
@property (nonatomic,assign)NSInteger position;
@property (nonatomic,assign)BOOL inQueue;
@end

NS_ASSUME_NONNULL_END
