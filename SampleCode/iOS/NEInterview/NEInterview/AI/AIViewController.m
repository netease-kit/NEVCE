//
//  AIViewController.m
//  NEInterview
//
//  Created by Ginger on 2021/9/27.
//

#import "AIViewController.h"
#import <WebKit/WebKit.h>
#import "WKWebView+SchemeExtersion.h"
#import "Masonry.h"
#import "NEAIMessageCache.h"
#import "NEAIMessageCell.h"
#import "NEAIProgressLabel.h"
#import "NECustomURLSchemeHandler.h"
#import "NEAudioRecorder.h"
#import <CommonCrypto/CommonDigest.h>
#import <AVFoundation/AVFoundation.h>

@interface AIViewController () <WKUIDelegate, WKNavigationDelegate, UITextFieldDelegate, UITableViewDataSource, UITableViewDelegate, NEAIMessageCacheDelegate, NEAIProgressLabelDelegate>

@property (nonatomic, strong) WKWebView *webView;
@property (nonatomic, strong) UIView *cameraView;
@property (nonatomic, strong) UITableView *messageView;
@property (nonatomic, strong) UIView *inputView;
@property (nonatomic, strong) NEAIProgressLabel *progressLabel;
@property (nonatomic, strong) NEAudioRecorder *audioRecorder;
@property (nonatomic, strong) AVCaptureSession *session;

@end

@implementation AIViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    
    self.title = @"智慧云营业厅";
    self.view.backgroundColor = [UIColor whiteColor];
    
    [NEAIMessageCache sharedInstance].delegate = self;
    
    [self layoutSubviews];
    
    self.audioRecorder = [[NEAudioRecorder alloc] init];
}

- (void)layoutSubviews {
    float width = [UIScreen mainScreen].bounds.size.width/2 - 20 - 4;
    float height = 16*width/9;
    
    UIView *textBackView = [[UIView alloc] initWithFrame:CGRectZero];
    textBackView.layer.backgroundColor = [UIColor colorWithRed:0.946 green:0.977 blue:1 alpha:1].CGColor;
    textBackView.layer.cornerRadius = 4;
    textBackView.layer.borderWidth = 1;
    textBackView.layer.borderColor = [UIColor colorWithRed:0.75 green:0.842 blue:1 alpha:1].CGColor;
    [self.view addSubview:textBackView];
    [textBackView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.leading.mas_equalTo(20);
        make.trailing.mas_equalTo(-20);
        make.height.mas_equalTo(84);
        if (@available(iOS 11.0, *)) {
            make.top.mas_equalTo(self.view.mas_safeAreaLayoutGuideTop).offset(12);
        } else {
            make.top.mas_equalTo(self.view).offset(12);
        }
    }];
    
    UILabel *textLabel = [[UILabel alloc] init];
    textLabel.numberOfLines = 0;
    textLabel.textColor = [UIColor colorWithRed:0.4 green:0.4 blue:0.4 alpha:1];
    textLabel.font = [UIFont fontWithName:@"PingFangSC-Regular" size:14];
    textLabel.text = @"使用过程中请确保环境光线充足，安静无干扰。为保证服务质量，服务全程将录音录像，录制文件默认存储在相册中";
    [textBackView addSubview:textLabel];
    [textLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.leading.mas_equalTo(16);
        make.trailing.mas_equalTo(-16);
        make.top.mas_equalTo(12);
        make.bottom.mas_equalTo(-12);
    }];
    
    WKWebViewConfiguration *configuration = [WKWebViewConfiguration new];
    NECustomURLSchemeHandler *handler = [NECustomURLSchemeHandler new];
    [configuration setURLSchemeHandler:handler forURLScheme:@"https"];
    [configuration setURLSchemeHandler:handler forURLScheme:@"http"];
    self.webView = [[WKWebView alloc] initWithFrame:self.view.frame configuration:configuration];
    self.webView.UIDelegate = self;
    self.webView.navigationDelegate = self;
    self.webView.allowsBackForwardNavigationGestures = false;
    NSString *urlString = @"https://kefu-h5.apps-qa.danlu.netease.com/?fov=20&target={\"x\":0,\"y\":1.5,\"z\":0}&camera={\"x\":0,\"y\":1.5,\"z\":2.61}";
    urlString = [urlString stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"\"{}"].invertedSet];
    NSURL *url = [NSURL URLWithString:urlString];
    [self.webView loadRequest:[NSURLRequest requestWithURL:url]];
    [self.view addSubview:self.webView];
    [self.webView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.height.mas_equalTo(height);
        make.width.mas_equalTo(width);
        make.leading.mas_equalTo(20);
        make.top.mas_equalTo(textBackView.mas_bottom).offset(12);
    }];
    
    self.cameraView = [[UIView alloc] init];
    self.cameraView.backgroundColor = [UIColor blackColor];
    [self.view addSubview:self.cameraView];
    [self.cameraView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.height.mas_equalTo(height);
        make.width.mas_equalTo(width);
        make.leading.mas_equalTo(self.webView.mas_trailing).offset(8);
        make.top.mas_equalTo(textBackView.mas_bottom).offset(12);
    }];
    
    UIView *line = [[UIView alloc] init];
    line.backgroundColor = [UIColor colorWithRed:0.951 green:0.951 blue:0.951 alpha:1];
    [self.view addSubview:line];
    [line mas_makeConstraints:^(MASConstraintMaker *make) {
        make.leading.mas_equalTo(0);
        make.trailing.mas_equalTo(0);
        make.top.mas_equalTo(self.webView.mas_bottom).offset(20);
        make.height.mas_equalTo(16);
    }];
    
    self.inputView = [[UIView alloc] init];
    [self.view addSubview:self.inputView];
    [self.inputView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.height.mas_equalTo(50);
        make.leading.mas_equalTo(0);
        make.trailing.mas_equalTo(0);
        if (@available(iOS 11.0, *)) {
            make.bottom.mas_equalTo(self.view.mas_safeAreaLayoutGuideBottom);
        } else {
            make.bottom.mas_equalTo(self.view);
        }
    }];
    
    self.progressLabel = [[NEAIProgressLabel alloc] init];
    self.progressLabel.delegate = self;
    [self.inputView addSubview:self.progressLabel];
    [self.progressLabel mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(6);
        make.leading.mas_equalTo(20);
        make.trailing.mas_equalTo(-20);
        make.bottom.mas_equalTo(0);
    }];
    
    self.messageView = [[UITableView alloc] initWithFrame:CGRectZero style:UITableViewStylePlain];
    self.messageView.dataSource = self;
    self.messageView.delegate = self;
    self.messageView.separatorStyle = UITableViewCellSeparatorStyleNone;
    self.messageView.showsVerticalScrollIndicator = false;
    self.messageView.allowsSelection = false;
    [self.messageView registerClass:[NEAIMessageCell class] forCellReuseIdentifier:@"CallIdentifier"];
    [self.view addSubview:self.messageView];
    [self.messageView mas_makeConstraints:^(MASConstraintMaker *make) {
        make.top.mas_equalTo(line.mas_bottom);
        make.leading.mas_equalTo(0);
        make.trailing.mas_equalTo(0);
        make.bottom.mas_equalTo(self.inputView.mas_top);
    }];
    
    self.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc] initWithTitle:@"重新说话" style:UIBarButtonItemStylePlain target:self action:@selector(startRecord)];
    self.navigationItem.leftBarButtonItem = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"ico_back"] style:UIBarButtonItemStylePlain target:self action:@selector(back)];
}

- (void)back {
    [self.navigationController popToRootViewControllerAnimated:YES];
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self startRecord];
    [self startCamera];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
    [self stopCamera];
}

- (void)startRecord {
    [self.audioRecorder startRecord];
    [self.progressLabel startProgress];
}

- (void)startCamera {
    if (self.session) {
        [self.session startRunning];
        return;
    }
    self.session = [[AVCaptureSession alloc] init];
    self.session.sessionPreset = AVCaptureSessionPresetPhoto;
    AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithDeviceType:AVCaptureDeviceTypeBuiltInWideAngleCamera mediaType:AVMediaTypeVideo position:AVCaptureDevicePositionFront];
    AVCaptureDeviceInput *videoInput = [AVCaptureDeviceInput deviceInputWithDevice:device error:nil];
    if ([self.session canAddInput:videoInput]) {
        [self.session addInput:videoInput];
    }
    
    AVCaptureVideoPreviewLayer *previewLayer = [AVCaptureVideoPreviewLayer layerWithSession:self.session];
    previewLayer.videoGravity = AVLayerVideoGravityResizeAspectFill;
    previewLayer.frame = self.cameraView.layer.bounds;
    [self.cameraView.layer insertSublayer:previewLayer atIndex:0];
    
    [self.session startRunning];
}

- (void)stopCamera {
    if (self.session) {
        [self.session stopRunning];
    }
}

#pragma mark - NEAIProgressLabelDelegate
- (void)progerssLabelDidStop:(NEAIProgressLabel *)label {
    [self uploadAudio:[self.audioRecorder stopRecord]];
}

- (void)uploadAudio:(NSString *)filePath {
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:[NSURL URLWithString:@"https://sfasr-vop.163yun.com/v1/sfasr"] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:20];
    request.HTTPMethod = @"POST";
    NSMutableDictionary *header = [NSMutableDictionary dictionary];
    [header setObject:@"" forKey:@"appkey"];
    [header setObject:@"" forKey:@"appId"];
    [header setObject:@"12345" forKey:@"nonce"];
    NSTimeInterval timestamp = [[NSDate date] timeIntervalSince1970];
    [header setObject:[NSString stringWithFormat:@"%0.f", timestamp] forKey:@"timestamp"];
    NSString *sign = [self getSignWithAppId:@"" nonce:@"12345" timestamp:timestamp baseModelId:@"123" appsecret:@""];
    [header setObject:sign forKey:@"sign"];
    [header setObject:@"audio/wave" forKey:@"Content-Type"];
    [header setObject:[NSString stringWithFormat:@"%d", 2] forKey:@"baseModelId"];
    request.allHTTPHeaderFields = header;
    NSData *data = [[NSData alloc] initWithContentsOfFile:filePath];
    NSLog(@"filePath:%@,fileSize:%ld", filePath, data.length);
    request.HTTPBody = data;
    NSURLSessionTask *sessionTask = [[NSURLSession sharedSession] dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        NSInteger status = [(NSHTTPURLResponse *)response statusCode];
        if (status == 200 && data) {
//            [[NSFileManager defaultManager] removeItemAtPath:filePath error:nil];
            NSDictionary *jsonData = [NSJSONSerialization JSONObjectWithData:data
                                                       options:0
                                                         error:nil];
            int code = [[jsonData objectForKey:@"code"] intValue];
            NSDictionary *detail = [jsonData objectForKey:@"detail"];
            NSString *msg = [jsonData objectForKey:@"msg"];
            NSLog(@"========================");
            NSLog(@"%@", detail);
            NSLog(@"========================");
            if (code == 10000) {
                NSString *duration = [detail objectForKey:@"duration"];
                NSString *result = [detail objectForKey:@"result"];
                NSString *taskId = [detail objectForKey:@"taskId"];
                dispatch_async(dispatch_get_main_queue(), ^{
                    NEAIMessage *m = [[NEAIMessage alloc] init];
                    m.isSend = true;
                    m.text = result;
                    [[NEAIMessageCache sharedInstance] addMessage:m];
                    [self->_webView evaluateJavaScript:[NSString stringWithFormat:@"text2Motion('%@')", result] completionHandler:^(id _Nullable result, NSError * _Nullable error) {
                        NSLog(@"result:%@ error:%@", result, error.description);
                    }];
                });
            }
        }
    }];
    [sessionTask resume];
}

- (NSString *)getSignWithAppId:(NSString *)appId nonce:(NSString *)nonce timestamp:(double)timestamp baseModelId:(NSString *)baseModelId appsecret:(NSString *)appsecret {
    NSMutableString *string = [NSMutableString string];
    [string appendString:@"appId="];
    [string appendString:[self converToURLString:appId]];
//    [string appendString:@"&baseModelId="];
//    [string appendString:[self converToURLString:baseModelId]];
    [string appendString:@"&nonce="];
    [string appendString:[self converToURLString:nonce]];
    [string appendString:@"&timestamp="];
    [string appendString:[self converToURLString:[NSString stringWithFormat:@"%0.f", timestamp]]];
    [string appendString:@"&appsecret="];
    [string appendString:appsecret];
    return [self md5HexDigest:string].uppercaseString;
}

- (NSString *)converToURLString:(NSString *)string {
    return [string stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet characterSetWithCharactersInString:@"?!@#$^&%*+,:;='\"`<>()[]{}/\\| "].invertedSet];
}

- (NSString* )md5HexDigest:(NSString* )input {
    const char *utf8 = [input UTF8String];
    unsigned char mdc[16];
    CC_MD5(utf8, (CC_LONG)strlen(utf8), mdc);
    NSMutableString *md5String = [NSMutableString string];
    for (int i = 0; i < 16; i ++) {
        [md5String appendFormat:@"%02x", mdc[i]];
    }
    return md5String;
}

#pragma mark - NEAIMessageCacheDelegate
- (void)cache:(NEAIMessageCache *)cache didAddMessage:(NEAIMessage *)message {
    [self.messageView reloadData];
    [self scrollToBottom];
    // 说明收到了AI的回复，继续下一次录音
    if (!message.isSend) {
        dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5.0 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
            [self startRecord];
        });
    }
}

- (void)cache:(NEAIMessageCache *)cache didRemoveMessage:(NEAIMessage *)message {
    
}

#pragma mark - UITableViewDataSource & UITableViewDelegate
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
    return [NEAIMessageCache sharedInstance].messageList.count;
}

- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    return [[NEAIMessageCache sharedInstance].messageList objectAtIndex:indexPath.row].cellHeight;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    NEAIMessageCell *cell = [tableView dequeueReusableCellWithIdentifier:@"CallIdentifier"];
    NEAIMessage *message = [[NEAIMessageCache sharedInstance].messageList objectAtIndex:indexPath.row];
    [cell configWithMessage:message];
    return cell;
}

- (void)scrollToBottom {
    NSUInteger count = [NEAIMessageCache sharedInstance].messageList.count;
    if (count) {
        NSIndexPath *indexPath = [NSIndexPath indexPathForItem:count - 1 inSection:0];
        [self.messageView scrollToRowAtIndexPath:indexPath atScrollPosition:UITableViewScrollPositionBottom animated:false];
    }
}

- (void)dealloc {
    [self.progressLabel stopProgress];
    [[NEAIMessageCache sharedInstance] clear];
}

@end
