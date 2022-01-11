//
//  SceneDelegate.m
//  NEInterview
//
//  Created by 郭园园 on 2021/1/25.
//

#import "SceneDelegate.h"
#import "HomeViewController.h"
#import "ENavigationViewController.h"
#import "Config.h"
#import "NERtcVideoCall.h"
#import <NEMeetingSDK/NEMeetingSDK.h>
#import <Reachability/Reachability.h>

@interface SceneDelegate ()

@end

@implementation SceneDelegate

- (void)scene:(UIScene *)scene willConnectToSession:(UISceneSession *)session options:(UISceneConnectionOptions *)connectionOptions {
    [self setupWindow:scene];
}

- (void)setupWindow:(UIScene *)scene {
    self.window = [[UIWindow alloc] initWithWindowScene:scene];
    HomeViewController *homeVC = [[HomeViewController alloc] init];
    ENavigationViewController *navgationViewCOntroller = [[ENavigationViewController alloc] initWithRootViewController:homeVC];
    self.window.rootViewController = navgationViewCOntroller;
    [self.window makeKeyAndVisible];
    [self setupIMSDK];
    [self setupMeetingSDK];
}
- (void)setupIMSDK {
    [[NERtcVideoCall shared] setupAppKey:kIMAppKey];
}

- (void)setupMeetingSDK {
    NEMeetingSDKConfig *config = [[NEMeetingSDKConfig alloc] init];
    config.appKey = kAppKey;
    config.enableDebugLog = YES;
    config.reuseNIM = YES;
    config.appName = @"智慧云营业厅";
    [[NEMeetingSDK getInstance] initialize:config
                                  callback:^(NSInteger resultCode, NSString *resultMsg, id result) {
        NSLog(@"[demo init] code:%@ msg:%@ result:%@", @(resultCode), resultMsg, result);
    }];
}
//-(void)listenNetWorkingStatus {
//    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(reachabilityChanged:) name:kReachabilityChangedNotification object:nil];
//    Reachability *reachbility = [Reachability reachabilityForInternetConnection];
//    [reachbility startNotifier];
//}
//- (void)reachabilityChanged:(NSNotification *)note
// {
//     Reachability* curReach = [note object];
//     [self updateInterfaceWithReachability:curReach];
// }
//
// - (void)updateInterfaceWithReachability:(Reachability *)reachability
// {
//     NetworkStatus netStatus = [reachability currentReachabilityStatus];
//     switch (netStatus) {
//       case 0:
//             [[UIApplication sharedApplication].keyWindow makeToast:@"网络出错，请检查您的网络"];
//         break;
//       case 1:
//       case 2:
//             [[UIApplication sharedApplication].keyWindow makeToast:@"网络已经恢复"];
//         break;
//       default:
//         break;
//      }
// }
 - (void)dealloc {
     NSLog(@"%@ dealloc",[self class]);
     [[NSNotificationCenter defaultCenter] removeObserver:self name:kReachabilityChangedNotification object:nil];
 }

- (void)sceneDidDisconnect:(UIScene *)scene {
    // Called as the scene is being released by the system.
    // This occurs shortly after the scene enters the background, or when its session is discarded.
    // Release any resources associated with this scene that can be re-created the next time the scene connects.
    // The scene may re-connect later, as its session was not necessarily discarded (see `application:didDiscardSceneSessions` instead).
}


- (void)sceneDidBecomeActive:(UIScene *)scene {
    // Called when the scene has moved from an inactive state to an active state.
    // Use this method to restart any tasks that were paused (or not yet started) when the scene was inactive.
}


- (void)sceneWillResignActive:(UIScene *)scene {
    // Called when the scene will move from an active state to an inactive state.
    // This may occur due to temporary interruptions (ex. an incoming phone call).
}


- (void)sceneWillEnterForeground:(UIScene *)scene {
    // Called as the scene transitions from the background to the foreground.
    // Use this method to undo the changes made on entering the background.
}


- (void)sceneDidEnterBackground:(UIScene *)scene {
    // Called as the scene transitions from the foreground to the background.
    // Use this method to save data, release shared resources, and store enough scene-specific state information
    // to restore the scene back to its current state.
}


@end
