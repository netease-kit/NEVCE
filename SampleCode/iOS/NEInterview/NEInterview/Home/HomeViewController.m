//
//  HomeViewController.m
//  NEInterview
//
//  Created by 郭园园 on 2021/1/25.
//

#import "HomeViewController.h"
#import "CustomInputView.h"
#import "CustomSwitchView.h"
#import "CustomSeletBusinessView.h"
#import "LoginTask.h"
#import "CustomPickView.h"
#import "Config.h"
#import <Reachability/Reachability.h>
#import "NSString+NE.h"
#import <NELog/NELog.h>
#import "AppDelegate.h"
#import "NTESLDHomePageViewController.h"
#import <AVFoundation/AVFoundation.h>
#import "AIViewController.h"

@interface HomeViewController () <UITextFieldDelegate, NEGuestListener>
@property (nonatomic,assign)BOOL isVIP;
@property (nonatomic,strong)NSArray *businesses;
@property (nonatomic,strong)CustomPickView *pickView;
@property (nonatomic,strong)CustomSeletBusinessView *selectView;
@property (nonatomic,strong)LoginTask *task;
@property (nonatomic,strong)CustomInputView *nameView;
/// 选择的办理业务模型
@property (nonatomic,strong)NSDictionary *selectBusiness;
@end

@implementation HomeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    [self setupUI];
    [self getAccount];
    [NEGuest getInstance].delegate = self;
    
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(sdkInited) name:@"kMeetingSDKInitSucc" object:nil];
}

- (void)sdkInited {
    [self getAccount];
}
- (void)setupUI {
    if (Config.scene == NEVCESceneTypeOperator) {
        self.title = @"5G视频客服";
    } else {
        self.title = @"智慧云营业厅";
    }
    CustomInputView *nameView = [[CustomInputView alloc] init];
    nameView.textField.delegate = self;
    nameView.titleLabel.text = @"客户姓名";
    [self.view addSubview:nameView];
    if (@available(iOS 11.0, *)) {
        [nameView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.right.mas_equalTo(0);
            make.top.mas_equalTo(self.view.mas_safeAreaLayoutGuideTop).offset(50);
            make.height.mas_equalTo(44);
        }];
    } else {
        [nameView mas_makeConstraints:^(MASConstraintMaker *make) {
            make.left.right.mas_equalTo(0);
            make.top.mas_equalTo(50);
            make.height.mas_equalTo(44);
        }];
    }
    self.nameView = nameView;
    CustomSwitchView *switchView = [[CustomSwitchView alloc] init];
    switchView.titleLabel.text = @"是否VIP";
    [self.view addSubview:switchView];
    [switchView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(0);
        make.top.mas_equalTo(nameView.mas_bottom);
        make.height.mas_equalTo(44);
    }];
    
    UILabel *typeTitle = [[UILabel alloc] init];
    typeTitle.text = @"业务受理类型";
    [self.view addSubview:typeTitle];
    [typeTitle mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(20);
        make.right.mas_equalTo(-20);
        make.top.mas_equalTo(switchView.mas_bottom).offset(40);
        make.height.mas_equalTo(44);
    }];
    CustomSeletBusinessView *selectView = [[CustomSeletBusinessView alloc] init];
    [self.view addSubview:selectView];
    [selectView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.right.mas_equalTo(0);
        make.top.mas_equalTo(typeTitle.mas_bottom);
        make.height.mas_equalTo(44);
    }];
    
    UIButton *AIBtn = [[UIButton alloc] init];
    [AIBtn setTitle:@"呼叫虚拟人" forState:UIControlStateNormal];
    [AIBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    AIBtn.backgroundColor = [UIColor colorWithRed:51/255.0 green:126/255.0 blue:255/255.0 alpha:1];
    AIBtn.layer.cornerRadius = 25;
    AIBtn.layer.masksToBounds = YES;
    [self.view addSubview:AIBtn];
    [self.view addSubview:AIBtn];
    [AIBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(30);
        make.right.mas_equalTo(-30);
        make.height.mas_equalTo(50);
        if (@available(iOS 11.0, *)) {
            make.bottom.mas_equalTo(self.view.mas_safeAreaLayoutGuideBottom).offset(-190);
        } else {
            make.bottom.mas_equalTo(-140);
        }
    }];
    [AIBtn addTarget:self action:@selector(AIBtnEvent:) forControlEvents:UIControlEventTouchUpInside];
    
    UIButton *callBtn = [[UIButton alloc] init];
    [callBtn setTitle:@"发起呼叫" forState:UIControlStateNormal];
    [callBtn setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
    callBtn.backgroundColor = [UIColor colorWithRed:51/255.0 green:126/255.0 blue:255/255.0 alpha:1];
    callBtn.layer.cornerRadius = 25;
    callBtn.layer.masksToBounds = YES;
    [self.view addSubview:callBtn];
    [self.view addSubview:callBtn];
    [callBtn mas_makeConstraints:^(MASConstraintMaker *make) {
        make.left.mas_equalTo(30);
        make.right.mas_equalTo(-30);
        make.height.mas_equalTo(50);
        if (@available(iOS 11.0, *)) {
            make.bottom.mas_equalTo(self.view.mas_safeAreaLayoutGuideBottom).offset(-130);
        } else {
            make.bottom.mas_equalTo(-140);
        }
    }];
    
    [callBtn addTarget:self action:@selector(callBtnEvent:) forControlEvents:UIControlEventTouchUpInside];
    [switchView.switchButton addTarget:self action:@selector(switchBtnEvent:) forControlEvents:UIControlEventValueChanged];
    [selectView.selectBtn addTarget:self action:@selector(selectBtnEvent:) forControlEvents:UIControlEventTouchUpInside];
    self.selectView = selectView;
    
    [self checkAuthorization];
}

- (void)checkAuthorization {
    // 第一次安装的时候主动询问权限，避免在通话界面出现多次弹框的提示
    AVAuthorizationStatus audioAuthStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeAudio];
    if (audioAuthStatus == AVAuthorizationStatusNotDetermined) {
        [AVCaptureDevice requestAccessForMediaType:AVMediaTypeAudio completionHandler:^(BOOL granted) {
                    
        }];
    }
    
    AVAuthorizationStatus videoAuthStatus = [AVCaptureDevice authorizationStatusForMediaType:AVMediaTypeVideo];
    if (videoAuthStatus == AVAuthorizationStatusNotDetermined) {
        [AVCaptureDevice requestAccessForMediaType:AVMediaTypeVideo completionHandler:^(BOOL granted) {
                    
        }];
    }
}

#pragma mark - event
- (void)switchBtnEvent:(UISwitch *)switchBtn {
    self.isVIP = switchBtn.isOn;
}
- (void)selectBtnEvent:(UIButton *)button {
    if (self.nameView.textField.isFirstResponder) {
        [self.nameView.textField resignFirstResponder];
    }
    if (self.pickView.superview) {
        return;
    }
    [self.view addSubview:self.pickView];
    
    if (![NEGuest getInstance].isInited) {
        [AppDelegate setupSDK];
    } else {
        [self selectBusiness];
    }
}

- (void)AIBtnEvent:(UIButton *)button {
    AIViewController *view = [[AIViewController alloc] init];
    [self.navigationController pushViewController:view animated:true];
}

- (void)callBtnEvent:(UIButton *)button {
//    [self.nameView.textField.text byteLength];
    Reachability *reachability = [Reachability reachabilityForInternetConnection];
    BOOL isReachable = [reachability isReachable];
    if (!isReachable) {
        [self.view makeToast:@"网络出错，请检查您的网络"];
        return;
    }
    if ([self.nameView.textField.text byteLength] <= 0) {
        [self.view makeToast:@"请输入客户姓名"];
        return;
    }
    if ([self.nameView.textField.text byteLength] > 20) {
        [self.view makeToast:@"客户姓名最多支持10个汉字或20个英文字母"];
        return;
    }
    if (!self.selectBusiness) {
        [self.view makeToast:@"请选择业务类型"];
        return;
    }
    [self enterCallViewBusinessType:self.selectBusiness[@"code"] queuePriority:nil];
}

#pragma mark - private method
- (void)getAccount {
    if (![NEGuest getInstance].isInited) {
        return;
    }
    __weak typeof(self)weakSelf = self;
    LoginTask *task = [LoginTask taskWithSubURL:@"/v1/sdk/account/anonymous"];
    [task postWithCompletion:^(NSDictionary * _Nullable data, LoginTask *task, NSError * _Nullable error) {
        if (error) {
            [weakSelf.view makeToast:@"获取账号失败"];
        } else {
            [[NEGuest getInstance] loginWithAccountId:task.accountId token:task.accountToken callback:^(NSInteger resultCode, NSString *resultMsg, id resultData) {
                if (resultCode == 0) {
                    [[NSUserDefaults standardUserDefaults] setObject:task.accountId forKey:@"accountId"];
                    [[NSUserDefaults standardUserDefaults] setObject:task.accountToken forKey:@"accountToken"];
                    [weakSelf requestBusinessList];
                    [weakSelf.view makeToast:@"登录成功"];
                } else {
                    [weakSelf.view makeToast:[NSString stringWithFormat:@"登录失败，%@", resultMsg]];
                }
            }];
        }
    }];
}

- (void)requestBusinessList {
    NELogInfo(@"requestBusinessList");
    [[NEGuest getInstance] queryGroupsListWithCallback:^(NSInteger resultCode, NSString *resultMsg, id resultData) {
        self.pickView.businesses = resultData;
        self.businesses = resultData;
    }];
}
- (void)enterCallViewBusinessType:(NSString *)type queuePriority:(NSString *)queuePriority {
    NELogInfo(@"enterCallViewBusinessType type:%@ queuePriority:%@", type, queuePriority);
    [[NEGuest getInstance] callWithUIWithGroupId:type isVIP:self.isVIP displayName:self.nameView.textField.text callback:^(NSInteger resultCode, NSString *resultMsg, id resultData) {

    }];
}

#pragma mark - NERtcVideoCallDelegate

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
    if (self.nameView.textField.isFirstResponder) {
        [self.nameView.textField resignFirstResponder];
    }
}
#pragma mark - get

- (CustomPickView *)pickView {
    if (!_pickView) {
        _pickView = [[CustomPickView alloc] initWithFrame:self.view.bounds];
        __weak typeof(self) weakSelf = self;
        _pickView.didSelectIndex = ^(NSInteger index) {
            if (weakSelf.businesses.count) {
                weakSelf.selectBusiness = weakSelf.businesses[index];
                [weakSelf.selectView.selectBtn setTitle:weakSelf.selectBusiness[@"desc"] forState:UIControlStateNormal];
            }
        };
    }
    return _pickView;
}

#pragma mark - NEGuestListener

- (void)onCallStateChangedNotifyWithCallState:(NEVCECallState)callState endReason:(NSInteger)reason {
    NSLog(@"native: callState:%@ reason:%@", @(callState), @(reason));
    switch (callState) {
        case NEVCECallStateIdle:
//            [self.view makeToast:@"通话结束"];
            break;
        case NEVCECallStateOutgoing:
            [self.view makeToast:@"呼出"];
            break;
        case NEVCECallStateIncoming:
            [self.view makeToast:@"来电"];
            break;
        case NEVCECallStateTalking:
            [self.view makeToast:@"接通"];
            break;
        default:
            break;
    }
}

- (void)onQueueInfoNotifyWithPosition:(NSInteger)position time:(NSInteger)time {
    NSLog(@"native: position:%@ time:%@", @(position), @(time));
}

- (void)onLoginStateChangedNotifyWithCurrent:(NEVCELoginState)current reason:(NSInteger)reason {
    NSLog(@"native: current:%@ reason:%@", @(current), @(reason));
    switch (current) {
        case NEVCELoginStateIdle:
            [self.view makeToast:@"已登出"];
            break;
        case NEVCELoginStateLogining:
            [self.view makeToast:@"登录中"];
            break;
        case NEVCELoginStateLogined:
            [self.view makeToast:@"已登录"];
            break;
        case NEVCELoginStateLogouting:
            [self.view makeToast:@"登出中"];
            break;
        default:
            break;
    }
}

- (void)onTransferedNotifyWithGroups:(NSArray<NSString *> *)groups {
    NSLog(@"native: groups:%@", groups);
}

@end
