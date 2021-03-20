git checkout $1
echo "export const VERSION = '`git describe --tags | cut -c1-5`';" > src/environments/version.ts
