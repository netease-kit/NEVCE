//
//  JoinQueueTask.m
//  NEInterview
//
//  Created by 郭园园 on 2021/2/1.
//

#import "JoinQueueTask.h"

@implementation JoinQueueTask
+ (instancetype)task {
    return [JoinQueueTask taskWithSubURL:@"/v1/sdk/queue/visitor/online"];
}
@end
