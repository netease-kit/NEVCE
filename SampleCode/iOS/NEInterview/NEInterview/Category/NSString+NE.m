//
//  NSString+NE.m
//  NEInterview
//
//  Created by 郭园园 on 2021/2/20.
//

#import "NSString+NE.h"

@implementation NSString (NE)

- (NSUInteger)byteLength {
    NSUInteger length = 0;
    for (NSUInteger i = 0; i < self.length; i++) {
        unichar uchar = [self characterAtIndex: i];
        length += isascii(uchar) ? 1 : 2;
    }
    NSLog(@"length:%d",length);
    return length;
}
@end
