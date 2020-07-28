set -o errexit

ROOT=$(dirname ${BASH_SOURCE[0]})

for file in $ROOT/values/*.yaml; do
    echo "Linting $file..."
    helm template TEST $ROOT/../chart -f $file >/dev/null
done
