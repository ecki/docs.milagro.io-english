Alice | Bob |  
|:--------------------------------:| :---------------------------------:|
|$x \in \mathbb{Z}_{q}^{*}$| |                     
| $AG1 := H_{1}(IdA)$|   |                      
|$ AG_{1} := H_{1}(IdA)$|   |                     
|$IdA, PaG_{1} \longrightarrow$|  |                   
                                                     $ y,w \in \mathbb{Z}_{q}^{*}$
                                                        $ AG_{1} := H_{1}(IdA)$
                                                        $ BG_{2} := H_{2}(IdB)$
                                                      $PbG_{2} := y\cdot BG_{2}$
                                                      $PgG_{1} := w\cdot AG_{1}$
                                           $pia := H_{q}(PaG_{1}\| PbG_{2} \| PgG_{1}\|IdB)$
                                           $pib := H_{q}(PbG_{2}\|PaG_{1} \|PgG_{1}\| IdA)$
                                      $k:=e(pia\cdot AG_{1}+PaG_{1},(y+pib)\cdot s \cdot BG_{2})$
                                                       $K:=H(k,w\cdot PaG_{1})$
                                                $\longleftarrow IdB, PgG_{1}, PbG_{2}$
$BG_{2} := H_{2}(IdB)$                       
$pia := H_{q}(PaG_{1}\| PbG_{2} \| PgG_{1}\|IdB)$          
$pib := H_{q}(PbG_{2}\|PaG_{1} \|PgG_{1}\| IdA)$          
$k := e((x+pia)\cdot s \cdot AG_{1}, pib\cdot BG_{2} + PbG_{2})$  
$K := H(k,x\cdot PgG_{1})$                     




Notes about notation:

-   $G_1$: a $r$-order cyclic subgroup of $E(F_p)$.

-   $G_2$: a subgroup of $E(F_{p^k})$, where $k$ is the embedding degree
of the Curve.

-   $H1$: Maps string value to a point on the curve in $G_1$.

-   $H2$: Maps string value to a point on the curve in $G_2$.

-   $Hq$: Hashes inputs to an integer modulo the curve order $q$.

-   H(): Hash function.

-   $||$: denotes the concatenation of messages.

A *bilinear pairing* $e$ maps a pair of points (hence the name pairing)
on an elliptic curve $E$, defined over some field $\mathbb{F}_{q}$, to
an element of the multiplicative group of a finite extension of
$\mathbb{F}_{q}$. $$e(aP, bQ) = e(P, Q)^{ab}$$ The elements $P$ and $Q$
lie in two different groups, respectively $G_{1}$ and $G_{2}$. The
choice of those two different group determines a different *types* of
pairing.

Let $E$ an ordinary elliptic curve, take $G_{1} \neq G_{2}$, if there is
not an efficiently computable isomorphism $\phi:G_{1}\to G_{2}$ then the
pairing is said to be of *type*$-3$. Nowadays all of the
state-of-the-art implementations of pairings take place on ordinary
curves that assume the type$-3$ scenario for reasons of efficiency and
secure implementation.


$x \in \mathbb{Z}_{q}^{*}$

$AG1 := H_{1}(IdA)$

$y = x^2 \hbox{ when $x > 2$}$.

\PaG_{1} := x\cdot AG_{1}

$IdA, PaG_{1} \longrightarrow$

 & $ y,w \in \mathbb{Z}_{q}^{*}$
 & $ AG_{1} := H_{1}(IdA)$\\
 & $ BG_{2} := H_{2}(IdB)$\\
 & $PbG_{2} := y\cdot BG_{2}$\\
 & $PgG_{1} := w\cdot AG_{1}$\\
 & $pia := H_{q}(PaG_{1}\| PbG_{2} \| PgG_{1}\|IdB)$\\
 & $pib := H_{q}(PbG_{2}\|PaG_{1} \|PgG_{1}\| IdA)$\\
 & $k:=e(pia\cdot AG_{1}+PaG_{1},(y+pib)\cdot s \cdot BG_{2})$\\
 & $K:=H(k,w\cdot PaG_{1})$\\
 & $\longleftarrow IdB, PgG_{1}, PbG_{2}$\\
$BG_{2} := H_{2}(IdB)$ & \\
$pia := H_{q}(PaG_{1}\| PbG_{2} \| PgG_{1}\|IdB)$ & \\
$pib := H_{q}(PbG_{2}\|PaG_{1} \|PgG_{1}\| IdA)$ & \\
$k := e((x+pia)\cdot s \cdot AG_{1}, pib\cdot BG_{2} + PbG_{2})$ & \\
$K := H(k,x\cdot PgG_{1})$ & \\
\hline
\end{tabular}
\end{center}
