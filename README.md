EP_BR_TO_P
==========

Wrap text in Paragraphs
-----------------------

From:

    'Prachtig is het licht dat uit de hemel neerdaalt.<br><br>Geen enkele faktor van dit probleem uit de weg gaan. Zich volledig inzetten.<br>Wij zullen het klaarspelen. De moeilijkheden van de eenzaamheid dienen volledig te worden behandeld.<br><br>Hij sterft zonder een enkele frase, de ogen vol tranen.'

To:

    '<p>Prachtig is het licht dat uit de hemel neerdaalt.</p><p>Geen enkele faktor van dit probleem uit de weg gaan. Zich volledig inzetten.<br>Wij zullen het klaarspelen. De moeilijkheden van de eenzaamheid dienen volledig te worden behandeld.</p><p>Hij sterft zonder een enkele frase, de ogen vol tranen.</p>'

This relies on the fact that we know the specifics of Etherpad’s output:
no whitespace, lowercase tags, no slashes in self-closing tags.

For a more general purpose implementation we would probably need to use
the DOM api through something like JSDOM.
