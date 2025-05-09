// Custom Chord Layout for D3 v5
function customChordLayout() {
  const ε = 1e-6;
  const ε2 = ε * ε;
  const π = Math.PI;
  const τ = 2 * π;
  const τε = τ - ε;
  const halfπ = π / 2;
  const d3_radians = π / 180;
  const d3_degrees = 180 / π;

  let chord = {};
  let chords;
  let groups;
  let matrix;
  let n;
  let padding = 0;
  let sortGroups;
  let sortSubgroups;
  let sortChords;

  function relayout() {
    const subgroups = {};
    const groupSums = [];
    const groupIndex = Array.from(Array(n).keys()); // D3 v5 replacement for d3.range()
    const subgroupIndex = [];
    let k, x, x0, i, j;

    chords = [];
    groups = [];

    k = 0, i = -1;
    while (++i < n) {
      x = 0, j = -1;
      while (++j < n) {
        x += matrix[i][j];
      }
      groupSums.push(x);
      subgroupIndex.push(Array.from(Array(n).keys()).reverse()); // D3 v5 replacement for d3.range().reverse()
      k += x;
    }

    if (sortGroups) {
      groupIndex.sort((a, b) => sortGroups(groupSums[a], groupSums[b]));
    }

    if (sortSubgroups) {
      subgroupIndex.forEach((d, i) => {
        d.sort((a, b) => sortSubgroups(matrix[i][a], matrix[i][b]));
      });
    }

    k = (τ - padding * n) / k;
    x = 0, i = -1;
    while (++i < n) {
      x0 = x, j = -1;
      while (++j < n) {
        const di = groupIndex[i];
        const dj = subgroupIndex[di][j];
        const v = matrix[di][dj];
        const a0 = x;
        const a1 = x += v * k;
        
        subgroups[di + "-" + dj] = {
          index: di,
          subindex: dj,
          startAngle: a0,
          endAngle: a1,
          value: v
        };
      }
      
      groups[di] = {
        index: di,
        startAngle: x0,
        endAngle: x,
        value: (x - x0) / k
      };
      
      x += padding;
    }

    i = -1;
    while (++i < n) {
      j = i - 1;
      while (++j < n) {
        const source = subgroups[i + "-" + j];
        const target = subgroups[j + "-" + i];
        
        if (source.value || target.value) {
          chords.push(source.value < target.value ? {
            source: target,
            target: source
          } : {
            source: source,
            target: target
          });
        }
      }
    }

    if (sortChords) resort();
  }

  function resort() {
    chords.sort((a, b) => 
      sortChords(
        (a.source.value + a.target.value) / 2, 
        (b.source.value + b.target.value) / 2
      )
    );
  }

  chord.matrix = function(x) {
    if (!arguments.length) return matrix;
    n = (matrix = x) && matrix.length;
    chords = groups = null;
    return chord;
  };

  chord.padding = function(x) {
    if (!arguments.length) return padding;
    padding = x;
    chords = groups = null;
    return chord;
  };

  chord.sortGroups = function(x) {
    if (!arguments.length) return sortGroups;
    sortGroups = x;
    chords = groups = null;
    return chord;
  };

  chord.sortSubgroups = function(x) {
    if (!arguments.length) return sortSubgroups;
    sortSubgroups = x;
    chords = null;
    return chord;
  };

  chord.sortChords = function(x) {
    if (!arguments.length) return sortChords;
    sortChords = x;
    if (chords) resort();
    return chord;
  };

  chord.chords = function() {
    if (!chords) relayout();
    return chords;
  };

  chord.groups = function() {
    if (!groups) relayout();
    return groups;
  };

  return chord;
}