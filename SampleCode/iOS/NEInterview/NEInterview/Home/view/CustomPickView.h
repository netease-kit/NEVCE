//
//  CustomPickView.h
//  NEInterview
//
//  Created by 郭园园 on 2021/1/31.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface CustomPickView : UIView<UIPickerViewDelegate,UIPickerViewDataSource>
@property (nonatomic,strong)UIPickerView *pickerView;
@property (nonatomic,strong)NSArray <NSDictionary *>*businesses;
@property (nonatomic,copy)void(^didSelectIndex)(NSInteger index);

@end

NS_ASSUME_NONNULL_END
