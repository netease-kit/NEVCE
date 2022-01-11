//
//  NSString+NE.h
//  NEInterview
//
//  Created by 郭园园 on 2021/2/20.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (NE)
/// 计算字节长度 汉字为2个字节
- (NSUInteger)byteLength;
@end

NS_ASSUME_NONNULL_END
