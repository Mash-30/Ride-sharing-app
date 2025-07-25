import app from './app';

const PORT = process.env.PORT || 5004;
 
app.listen(PORT, () => {
    console.log(`Payment service is running on port ${PORT}`);
}); 