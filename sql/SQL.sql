//创建全文索引
ALTER TABLE share ADD FULLTEXT INDEX ft_index (title) WITH PARSER ngram;

//更新数据
insert into share(category,feed_time,isdir,server_filename,size,saveTime,shareid,shorturl,title,uk,username) SELECT category,feed_time,isdir,server_filename,size,saveTime,shareid,shorturl,title,uk,username FROM share_new;

//索引停止和启用
ALTER TABLE share DISABLE KEYS;
ALTER TABLE share ENABLE KEYS;

#REPAIR TABLE `share` 修复表 
#OPTIMIZE TABLE `share` 优化表

//查看创建表语句
show create table share;

//查看索引
show index from share;

//删除重复
delete from share_new where id not in (select maxid from (select max(id) as maxid from share_new group by shareid) b);