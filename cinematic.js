(() => {
  const section = document.querySelector('[data-cinematic-section]');
  if (!section) return;

  const stage = section.querySelector('.cinematic-stage');
  const video = section.querySelector('[data-cinematic-video]');
  const intro = section.querySelector('[data-cinematic-intro]');
  const finale = section.querySelector('[data-cinematic-finale]');
  const progressBar = section.querySelector('#cinematic-progress');
  const scrollCue = section.querySelector('[data-cinematic-cue]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = Boolean(connection?.saveData);
  const slowConnection = ['slow-2g', '2g', '3g'].includes(connection?.effectiveType);
  const staticExperience = reducedMotion.matches || saveData || slowConnection;

  let videoRequested = false;
  let metadataReady = false;
  let frameRequested = false;
  let lastRequestedTime = null;
  let lastProgressPercent = -1;
  let videoFailureReported = false;
  let observer = null;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  function setStaticExperience(reason) {
    section.classList.add('is-static');
    stage.classList.remove('is-frame-ready');
    finale.inert = true;
    finale.setAttribute('aria-hidden', 'true');
    scrollCue.inert = true;
    scrollCue.setAttribute('aria-hidden', 'true');
    if (videoRequested) video.pause();
    if (reason) console.info(`[cinematic] Using the poster fallback: ${reason}`);
  }

  function requestVideo() {
    if (staticExperience || videoRequested) return;

    if (!video.canPlayType('video/mp4')) {
      setStaticExperience('MP4 playback is not supported in this browser.');
      return;
    }

    const source = video.querySelector('source[data-src]');
    if (!source) {
      setStaticExperience('The video source is unavailable.');
      return;
    }

    videoRequested = true;
    video.preload = 'auto';
    video.src = source.dataset.src;
  }

  function readProgress() {
    const sectionStart = window.scrollY + section.getBoundingClientRect().top;
    const scrollDistance = Math.max(1, section.offsetHeight - stage.offsetHeight);
    return clamp((window.scrollY - sectionStart) / scrollDistance);
  }

  function syncVideo(progress) {
    if (!metadataReady || video.readyState < HTMLMediaElement.HAVE_METADATA) return;

    const endFrameTime = Math.max(0, video.duration - 1 / 24);
    const targetTime = progress >= 1 ? endFrameTime : progress * video.duration;
    const seekThreshold = 0.03;
    const differsFromLastRequest = lastRequestedTime === null
      || Math.abs(targetTime - lastRequestedTime) >= seekThreshold;

    if (differsFromLastRequest && Math.abs(targetTime - video.currentTime) >= seekThreshold) {
      try {
        video.currentTime = targetTime;
        lastRequestedTime = targetTime;
      } catch (error) {
        console.warn('[cinematic] Video seek was rejected; the poster remains available.', error);
      }
    }

    if (!video.seeking && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      stage.classList.add('is-frame-ready');
    }
  }

  function update() {
    frameRequested = false;
    const progress = readProgress();
    const percent = Math.round(progress * 100);
    const introOpacity = 1 - clamp(progress / 0.22);
    const finaleOpacity = clamp((progress - 0.78) / 0.15);
    const cueOpacity = 1 - clamp(progress / 0.055);

    progressBar.style.transform = `scaleX(${progress})`;
    if (percent !== lastProgressPercent) {
      progressBar.setAttribute('aria-valuenow', String(percent));
      lastProgressPercent = percent;
    }

    intro.style.opacity = String(introOpacity);
    intro.style.transform = `translateY(${(1 - introOpacity) * -8}px)`;
    finale.style.opacity = String(finaleOpacity);
    finale.style.transform = `translateY(${(1 - finaleOpacity) * 12}px)`;
    finale.inert = progress < 0.83;
    finale.setAttribute('aria-hidden', String(progress < 0.83));
    scrollCue.style.opacity = String(cueOpacity);
    scrollCue.inert = progress > 0.055;
    scrollCue.setAttribute('aria-hidden', String(progress > 0.055));

    syncVideo(progress);
  }

  function scheduleUpdate() {
    if (frameRequested || staticExperience) return;
    frameRequested = true;
    window.requestAnimationFrame(update);
  }

  if (staticExperience) {
    const reason = reducedMotion.matches
      ? 'reduced motion is enabled.'
      : saveData
        ? 'data saving is enabled.'
        : 'a slow network connection was detected.';
    setStaticExperience(reason);
    return;
  }

  video.addEventListener('loadedmetadata', () => {
    metadataReady = Number.isFinite(video.duration) && video.duration > 0;
    scheduleUpdate();
  });

  video.addEventListener('loadeddata', scheduleUpdate);
  video.addEventListener('seeked', () => {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) stage.classList.add('is-frame-ready');
    scheduleUpdate();
  });

  function handleVideoError(event) {
    if (videoFailureReported) return;
    videoFailureReported = true;
    stage.classList.remove('is-frame-ready');
    section.classList.add('is-video-unavailable');
    console.warn('[cinematic] The video could not be loaded; the poster and portfolio navigation remain available.', video.error || event.type);
  }

  video.addEventListener('error', handleVideoError);
  video.querySelectorAll('source').forEach((source) => source.addEventListener('error', handleVideoError));
  if (video.error) handleVideoError({ type: 'media error' });

  if (video.readyState >= HTMLMediaElement.HAVE_METADATA && Number.isFinite(video.duration) && video.duration > 0) {
    metadataReady = true;
  }

  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate, { passive: true });

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      requestVideo();
      observer.disconnect();
      observer = null;
    }, { rootMargin: '100% 0px' });
    observer.observe(section);
  } else {
    requestVideo();
  }

  scheduleUpdate();
})();
