---
title: "在Rust中使用enum自定義錯誤類型"
date: 2020-03-28T12:28:45+08:00
draft: false
categories: ["tech"]
tags: ["rust", "design-pattern"]
---

Rust這款語言並不強調Object-Oriented特性，也沒有既定的錯誤處理機制，所以自定義錯誤的方法也有别於其他慣用語言，這𥚃介紹使用enum來實作。

<!--more-->

對哦，沒看錯，是用[enumeration](https://doc.rust-lang.org/book/ch06-01-defining-an-enum.html)！

讓我們先看看如果模仿其他OO語言`class extends Error`的方式用`struct`來`impl Error`是如何：

#### 用struct實作標準Error Trait

Rust標準庫裡提供了[std::error::Error](https://doc.rust-lang.org/std/error/trait.Error.html)，官方文檔裡可以找到例子教導我們如何在自己的`struct`上實作這個trait。

學習Rust時起初可能會這樣定義一個錯誤類型：

<iframe src="https://bit.ly/2wLTIP1" width="auto" height="400" style="width:100%"></iframe>

上面例子好像沒有太大問題，而當你的函數需要按情況返回不同的自定義錯誤時，大概會這樣做：

<iframe src="https://bit.ly/2Uoeop4" width="auto" height="400" style="width:100%"></iframe>

事情開始變得麻煩：

首先，為每個自定義錯誤類型編寫的代碼量很多；

因為函数會返回不同錯誤，返回值需要聲明為`dyn Error`，而又因為trait無法得知實際值的size，所以要用[std::boxed::Box](https://doc.rust-lang.org/std/boxed/struct.Box.html)封装起來；

然後，你獲得一個`Box<dyn Error>`類型的錯誤，但它實際上到底是屬於哪個錯誤？Rust没有像`instanceof`這樣的關鍵字可以作出區分，所以"按照不同錯誤類型去作不同的處理"這件事變得很困難；

再者，錯誤值可能需要𢹂带一些額外信息，例如字串、地理位置、或者另一個`struct`等等，那應該要如何提取呢？因為難以區分類型，信息的提取也變得非常困難。

最後，當我們的代碼引用第三方庫時，你確定它返回的錯誤類型有實作標準庫的Error trait嗎？知果没有的話，我們便可能需要在業務邏輯中每次都主動把它封装成自定義錯誤類型。

#### 用`enum`實作標準Error Trait

為每一個錯誤類型定義`struct`和實作`Error` trait實在是廢時失事，来看看如果使用`enum`來寫會是甚麼樣子：

<iframe src="https://bit.ly/2WOBKpD" width="auto" height="400" style="width:100%"></iframe>

這個`enum`侬然實作了`Error`和`fmt::Display` trait，能當作`Error`實例處理；

由於`enum`的size能夠在編澤時得知，所以不需要使用`Box<T>`封裝；

`enum`的Variants可以包含額外的資料，這是有别於其他主流語言的特性；

可利用`match`來配對實際的Variants，也就是説可以以此區分出各種類型，以及提取當中𢹂带的信息；

#### 封装第三方錯誤類型

對於第三方庫的錯誤類型，無論是甚麽資料結構，我們都可以為其實作`From<T>`，以方便重新封装成自定義的Variant：

(由於字數問题所以省略了`impl Error`和`impl fmt::Display`)
<iframe src="https://bit.ly/2y9MuEG" width="auto" height="400" style="width:100%"></iframe>

當`base64::decode`無法正確解碼而返回`Err(base64::DecodeError)`時，['`?`'操作符](https://doc.rust-lang.org/edition-guide/rust-2018/error-handling-and-panics/the-question-mark-operator-for-easier-error-handling.html)會讓`do_something()`返回這個`Err(base64::DecodeError)`，但由於函數定義返回值是`Result<String, MyError>`，Rust會在編譯時尋找你定義的`impl base64::DecodeError for MyError`，然後以隠式轉換的方式應用上去，換句話説就是實現了自動封装，你不需要顯式地呼叫任何函數進行轉換。

#### 在並發模型中使用`failure::Fail`

如果有在使用async function，想必你的錯誤類型需要同時實作`Sync` + `Send`，那麼[`failure::Fail`](https://docs.rs/failure/0.1.1/failure/trait.Fail.html)可以幫助你大幅減少代碼量。它定義是：

```rust
pub trait Fail: Display + Debug + Send + Sync + 'static {
    //......
}
```

而你就只需要在`enum`上`derive(Fail)`：

```rust
#[derive(Fail, Debug)]
pub enum MyError {
    EncodeError,
    DecodeError,
}
```

然後你的錯誤類型便滿足並發要求了。
