﻿# Image Sort

This tool allows sorting of images. Sorting items often requires comparisons which may be subjective or hard to implement. This tool lets you upload images and sort them by doing pairwise manual comparisons.

## The Algorithm

When comparisons are cheap, algorithms such as quicksort and mergesort are efficient. Although these algortihms are good for many use cases, they are bad when the cost of comparison is expensive since they need more comparisons than the theoretical bound. Instead we focus on the class of sorting algorithms that attempts to minimize the cost of comparison. Since this tool requires manual comparison by the user, we choose to implement a sorting algorithm known for its low number of comparisons: the Ford-Johnson algortihm (also known as Merge-Insertion Sort). This algorithm is known to be optimal for small instances and almost optimal for other instances.
