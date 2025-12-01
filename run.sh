FOLDER=$1 

for script in `ls $FOLDER`;
do
    echo "Running $script"
    k6 run $FOLDER/$script || true 
done

