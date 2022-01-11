#
# Be sure to run 'pod lib lint NEVCELib.podspec' to ensure this is a
# valid spec before submitting.
#
# Any lines starting with a # are optional, but their use is encouraged
# To learn more about a Podspec see https://guides.cocoapods.org/syntax/podspec.html
#

Pod::Spec.new do |s|
  s.name             = 'NEVCESDKDeps'
  s.version          = '0.1.0'
  s.summary          = 'A short description of NEVCESDK.'

# This description is used to generate tags and improve search results.
#   * Think: What does it do? Why did you write it? What is the focus?
#   * Try to keep it short, snappy and to the point.
#   * Write the description between the DESC delimiters below.
#   * Finally, don't worry about the indent, CocoaPods strips it!

  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = 'https://yunxin.163.com/'
  # s.screenshots     = 'www.example.com/screenshots_1', 'www.example.com/screenshots_2'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'NetEase, Inc.' => 'guoyuanyuan02@corp.netease.com'}
  s.source           = { :path => '.' }
  # s.social_media_url = 'https://twitter.com/<TWITTER_USERNAME>'

  s.ios.deployment_target = '9.0'

  s.static_framework = true
  arr = Array.new
  arr.push('NEVCELibs/dynamic/*.framework')
  s.ios.vendored_frameworks = arr

  # s.resource_bundles = {
  #   'NEVCELib' => ['NEVCELib/Assets/*.png']
  # }

  # s.public_header_files = 'Pod/Classes/**/*.h'
  # s.frameworks = 'UIKit', 'MapKit'
  s.dependency 'NEDyldYuv', '0.0.1'
  s.dependency 'NERtcSDK', '4.3.5'
  s.dependency 'NIMSDK_LITE', '~> 7.9.1'
  s.dependency 'Reachability'
  s.dependency 'YYModel', '~> 1.0.4'
  s.dependency 'Nama-lite', '7.3.2'
  s.dependency 'YXAlog_iOS', '~> 1.0.6'
end
