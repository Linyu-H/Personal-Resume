const { initDatabase, seedData } = require('./database');

try {
  console.log('正在初始化数据库...');
  initDatabase();
  seedData();
  console.log('数据库初始化完成！');
  process.exit(0);
} catch (error) {
  console.error('数据库初始化失败:', error);
  process.exit(1);
}
