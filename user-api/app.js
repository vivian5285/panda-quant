const adminRouter = require('./routes/admin');
const chainRoutes = require('./routes/chain');

// 注册路由
app.use('/api', userRouter);
app.use('/api/admin', adminRouter);
app.use('/api/chains', chainRoutes); 