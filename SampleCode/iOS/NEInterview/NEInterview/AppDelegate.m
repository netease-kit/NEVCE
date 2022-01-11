//
//  AppDelegate.m
//  NEInterview
//
//  Created by 郭园园 on 2021/1/25.
//

#import "AppDelegate.h"
#import <NELog/NELog.h>
#import "ENavigationViewController.h"
#import "HomeViewController.h"
#import "Config.h"
#import <Reachability/Reachability.h>
#import <NEVCESDK/NEVCESDK.h>
//#import <Bugly/Bugly.h>

@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
//    [Bugly startWithAppId:@"56b4eb91a8"];
    self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
    [self setupLog];
    HomeViewController *enterLessonVC = [[HomeViewController alloc] init];
    ENavigationViewController *navgationViewCOntroller = [[ENavigationViewController alloc] initWithRootViewController:enterLessonVC];
    self.window.rootViewController = navgationViewCOntroller;
    [self.window makeKeyAndVisible];
    [AppDelegate setupSDK];
    [self listenNetWorkingStatus];
    return YES;
}

- (void)setupLog {
    NELogOptions *opts = [[NELogOptions alloc] init];
    opts.level = NELogLevelDebug;
    opts.filePrefix = @"finance";
    opts.moduleName = @"finance";
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    opts.path = [paths.firstObject stringByAppendingPathComponent:@"/log"];
    [[NELog shared] setupWithOptions:opts];
}

+ (void)setupSDK {
    [[NEGuest getInstance] initializeWithAppkey:kAppKey broadcastAppGroup:@"group.com.netease.yunxin.app.finance" scene:Config.scene serverUrl:kApiHost callback:^(NSInteger resultCode, NSString *resultMsg, id resultData) {
        NSLog(@"flutter code:%@ msg:%@ result:%@", @(resultCode), resultMsg, resultData);
        if (resultCode == 0) {
            [self setToolbarMenuItems];
            [self setMoreMenuItems];
            [[NSNotificationCenter defaultCenter] postNotificationName:@"kMeetingSDKInitSucc" object:NULL];
        } else {

        }
    }];
}

+ (void)setToolbarMenuItems {
    NSMutableArray *array = [NSMutableArray array];
    [array addObject:NEMenuItems.mic];
    [array addObject:NEMenuItems.camera];
    [array addObject:NEMenuItems.screenShare];
    [array addObject:NEMenuItems.whiteboard];
    [[NEGuest getInstance] setInjectedToolbarMenuItems:array callback:^(NSInteger resultCode, NSString *resultMsg, id resultData) {

    }];
}

+ (void)setMoreMenuItems {
    NSMutableArray *array = [NSMutableArray array];
    [array addObject:NEMenuItems.chat];
    [[NEGuest getInstance] setInjectedMoreMenuItems:array callback:^(NSInteger resultCode, NSString *resultMsg, id resultData) {
            
    }];
}

-(void)listenNetWorkingStatus {
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reachabilityChanged:) name:kReachabilityChangedNotification object:nil];
    Reachability *reachbility = [Reachability reachabilityForInternetConnection];
    [reachbility startNotifier];
}

- (void)reachabilityChanged:(NSNotification *)note
{
     Reachability* curReach = [note object];
     [self updateInterfaceWithReachability:curReach];
 }
 
 - (void)updateInterfaceWithReachability:(Reachability *)reachability
 {
     NetworkStatus netStatus = [reachability currentReachabilityStatus];
     switch (netStatus) {
       case 0:
             [[UIApplication sharedApplication].keyWindow makeToast:@"网络出错，请检查您的网络"];
         break;
       case 1:
       case 2:
             [[UIApplication sharedApplication].keyWindow makeToast:@"网络已经恢复"];
         break;
       default:
         break;
      }
 }
 - (void)dealloc {
     NELogInfo(@"%@ dealloc",[self class]);
     [[NSNotificationCenter defaultCenter] removeObserver:self name:kReachabilityChangedNotification object:nil];
 }

@end
