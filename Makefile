bundle.js:	ex.js
	kaluma bundle ./$?

flash:	bundle.js
	kaluma flash ./$?

clean:
	-rm -f bundle.js

.PHONY:	flash clean

