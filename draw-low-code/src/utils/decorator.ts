/**
 * @name: 名称
 * @description: TODO 装饰器教程
 * @author: liudingbang
 * @date: 2025/9/7 11:40
 */
// 类装饰器,回调参数为类的构造函数
// 这个是工厂装饰器
function Logger(name: string) {
  // 这个是普通的装饰器
  return function (constructor: Function) {
    console.log('Logger')
    // 实例化类
    console.log(new constructor().name)
    console.log('操作名称:' + name)
  }
}

@Logger('新增')
class User {
  name = 'user'
}

// 方法装饰器

function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value
  descriptor.value = function (...args: any[]) {
    console.log(`调用方法 ${key}, 参数:`, args)
    return original.apply(this, args)
  }
}

class Service {
  @Log
  getData(id: number) {
    return { id }
  }
}

new Service().getData(1)
// 输出: 调用方法 getData, 参数: [1]

//  属性装饰器

function Readonly(target: any, key: string) {
  Object.defineProperty(target, key, { writable: false })
}

class Config {
  @Readonly
  version = '1.0.0'
}

const c = new Config()
c.version = '2.0.0' // ❌ 无效
console.log(c.version) // "1.0.0"

//  参数装饰器

function Inject(target: any, key: string, index: number) {
  console.log(`方法 ${key} 的第 ${index} 个参数被装饰`)
}

class Repo {
  find(@Inject id: number) {}
}
// 输出: 方法 find 的第 0 个参数被装饰

// 装饰器执行顺序
// 1.	参数装饰器
// 2.	方法装饰器
// 3.	属性装饰器
// 4.	类装饰器
//
// 多个装饰器时：从下往上执行。
