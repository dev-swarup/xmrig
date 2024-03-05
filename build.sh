mkdir build

cd scripts
bash build_deps.sh && cd ..

cd build
cmake .. -DXMRIG_DEPS=scripts/deps && make -j$(nproc);