//
//  VisitorInfo.h
//  NEInterview
//
//  Created by 郭园园 on 2021/2/2.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface VisitorInfo : NSObject
@property (nonatomic,strong)NSString *name;
/// vip等级，1-6
@property (nonatomic,assign)NSInteger vip;
@end

NS_ASSUME_NONNULL_END
