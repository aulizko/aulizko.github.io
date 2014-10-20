function fibonacci(limit)
{
  var fn1 = 1;
  var fn2 = 1;
  while (1)
  {
    var current = fn2;
    fn2 = fn1;
    fn1 = fn1 + current;
    if (limit && current > limit)
      return;
    yield current;
  }
}
