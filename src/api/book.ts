import Router from 'koa-router';
import { router } from './router';
import { BookEntity, UserCreatDto, UserEntity } from '@ship-website-demo/common';
import { getRepository } from "typeorm";
import { throwErrorResult } from '../util';

const bookRouter = new Router();

bookRouter.get('/', async (ctx, next) => {
  const bookRepository = getRepository(BookEntity);

  let books = await bookRepository.find({})
  if (!books.length) {
    books = [
      {
        title: '局外人',
        author: '阿尔贝·加缪',
        publishOrg: '译林出版社',
        publishTime: '2021-4-1',
        price: 49,
      },
      {
        title: '牧羊少年奇幻之旅',
        author: '保罗·柯艾略',
        publishOrg: '南海出版公司',
        publishTime: '2009-3-1',
        price: 25,
      },
      {
        title: '理想国',
        author: '柏拉图',
        publishOrg: '商务印书馆',
        publishTime: '1986-8',
        price: 28,
      },
      {
        title: '大问题 : 简明哲学导论',
        author: '罗伯特·所罗门、凯思林•希金斯',
        publishOrg: '广西师范大学出版社',
        publishTime: '2014-12',
        price: 65,
      },
      {
        title: '查拉图斯特拉如是说',
        author: '尼采',
        publishOrg: '新知三联书店',
        publishTime: '2007-12',
        price: 27,
      },
      {
        title: '美的历程',
        author: '李泽厚',
        publishOrg: '新知三联书店',
        publishTime: '2009-1-1',
        price: 43,
      },
      {
        title: '中国哲学简史',
        author: '冯友兰',
        publishOrg: '北京大学出版社',
        publishTime: '2013-1-1',
        price: 38,
      },
    ] as BookEntity[];
  }
  ctx.body = books;
  console.log('books', books);
  
  next();
});

router.use('/book', bookRouter.routes())
  .use(bookRouter.allowedMethods());