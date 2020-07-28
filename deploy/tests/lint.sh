set -o errexit

ROOT=`pwd`/deploy/tests

for file in $ROOT/values/*.yaml; do
    echo "Linting $file..."
    helm template TEST $ROOT/../chart -f $file >/dev/null
done
