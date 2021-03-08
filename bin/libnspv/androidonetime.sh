#
# make android libnspv in termux environment
#
./autogen.sh
./configure --enable-androidso=yes

# TODO: add cc lib to common Makefile.am
echo making cryptoconditions lib...
cd src/tools/cryptoconditions
./autogen.sh
./configure 
make

echo making libnspv and tools...
cd ../../..
make

