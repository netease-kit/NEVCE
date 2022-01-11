//
//  QueryQueueTask.m
//  NEInterview
//
//  Created by 郭园园 on 2021/2/1.
//

#import "QueryQueueTask.h"

@implementation QueryQueueTask
+ (instancetype)task {
    return [QueryQueueTask taskWithSubURL:@"/v1/sdk/queue/visitor/query"];
}
@end
