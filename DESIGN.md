# Design of App

## Entities 

* User - can use app
* post - can post 
* like - each post have multiple likes
* comment - comments on post

## Relationship

* each user have one acoount 
* each use can multiple post 
* each post have multiple likes and one use can one like each post 
* each post have multiple commetnts and use can multiple comments on each post 

* one user → many posts
* one post → many comments
* one post → many likes
* one user → many likes

## what each entities hace 

* user - user have email , password , username(uniqu) 
* post - each post have single user who post it , liked are link to post, have text, timestamp
* likes - it is replations ship btwn user and post and derivedd count from it
* commetns - each comments have text and timestamp 

## problems face might 

* single user can multiple likes in same post 
* authorization need to delete post or upload 


## solution of some problems 

* when user account delete like shoud be remove 
* when user account delete post also remove 
* but if user account delete than on other post comment shoudn stay just on user name it shoud shows deleted user 
* if post is deleted than likes and comment that refrece to it also shoud remove 