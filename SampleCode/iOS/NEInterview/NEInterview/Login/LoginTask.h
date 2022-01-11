//
//  LoginTask.h
//  NEInterview
//
//  Created by 郭园园 on 2021/1/31.
//

#import "NETask.h"

NS_ASSUME_NONNULL_BEGIN

@interface LoginTask : NETask
@property (nonatomic,strong)NSString *accountId;
@property (nonatomic,strong)NSString *accountToken;
/// IM账号
@property (nonatomic,strong)NSString *imAccid;
/// IMToken
@property (nonatomic,strong)NSString *imToken;

@end

NS_ASSUME_NONNULL_END
