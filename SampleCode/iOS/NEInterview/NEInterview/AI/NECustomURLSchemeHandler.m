//
//  NECustomURLSchemeHandler.m
//  WebViewDemo
//
//  Created by Ginger on 2021/9/28.
//

#import "NECustomURLSchemeHandler.h"
#import "NEAIMessageCache.h"

@implementation NECustomURLSchemeHandler

//这里拦截到URLScheme为customScheme的请求后，根据自己的需求,返回结果，并返回给WKWebView显示
- (void)webView:(WKWebView *)webView startURLSchemeTask:(id <WKURLSchemeTask>)urlSchemeTask{
    NSURLRequest *request = urlSchemeTask.request;
    NSURLSessionDataTask *task = [[NSURLSession sharedSession]
        dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        //也可以通过解析data等数据，通过data等数据来确定是否拦截
        //一个任务完成需要返回didReceiveResponse和didReceiveData两个方法
        //最后在执行didFinish，不可重复调用，可能会导致崩溃
        if (!data) {
            [urlSchemeTask didReceiveResponse:[NSURLResponse new]];
            [urlSchemeTask didReceiveData:data];
        } else {
            NSDictionary *jsonData = [NSJSONSerialization JSONObjectWithData:data
                                                                     options:0
                                                                       error:nil];
            if (jsonData[@"text"]) {
                NSLog(@"11111111111111 %@", jsonData[@"text"]);
            }
            if (jsonData[@"text"]) {
                NEAIMessage *m = [[NEAIMessage alloc] init];
                m.isSend = false;
                m.text = jsonData[@"text"];
                [[NEAIMessageCache sharedInstance] addMessage:m];
            }
            [urlSchemeTask didReceiveResponse:response];
            [urlSchemeTask didReceiveData:data];

        }
        [urlSchemeTask didFinish];
    }];
    [task resume];
}

- (void)webView:(WKWebView *)webVie stopURLSchemeTask:(id)urlSchemeTask {
    NSLog(@"stop = %@",urlSchemeTask);
}

@end
