# AWS EC2 Setup & Deploy Guide - INNOVATIO Frontend

This guide explains how to set up the AWS EC2 instance and deploy the frontend application using Node.js, Nginx, and PM2.

## 1. Connect to your EC2 instance

Use SSH with your `.pem` key:

```bash
ssh -i <PATH TO KEY>.pem ubuntu@<YOUR_PUBLIC_IP>

```

## 2. Install Node.js, npm, git

```bash
sudo apt update && sudo apt install -y nodejs npm git
```

### Install nvm and Node.js 20

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm install 20
nvm use 20
nvm alias default 20
node -v
npm -v
```

## 3. Clone frontend repo

```bash
git clone https://github.com/InnovatioG/front-end.git
cd front-end
git checkout main
npm install
```

## 4. Build app

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

## 5. Install and configure Nginx

```bash
sudo apt update
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/default
```

Replace contents with:

```bash
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then:

```bash
sudo systemctl restart nginx
sudo systemctl status nginx
```

## 6. Start app with PM2

```bash
npm install -g pm2
pm2 delete all
pm2 start npm --name "innovatio-app" -- start
pm2 save
```

## 7. Set up PM2 startup (auto-start on reboot)

```bash
pm2 startup
# Copy the command shown by pm2 and execute it (example):
sudo env PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.x.x/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
pm2 save
```

## 8. Check PM2 status or restart logs

```bash
pm2 status
pm2 restart innovatio-app
pm2 logs innovatio-app
```

## 9. Upload your .env file

From local machine to EC2:

```bash
scp -i <PATH TO KEY>.pem /<PATH TO LOCAL REPO>/.env.PREVIEW-AWS.local ubuntu@<YOUR_PUBLIC_IP>:~/front-end/.env.local
```

## ✅ Done

The app will now be running at `http://<YOUR_PUBLIC_IP>`. Make sure your security group allows inbound traffic on port 80.
