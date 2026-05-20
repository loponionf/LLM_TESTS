# AI_CHATGPT_AHK.md — ChatGPT/Claude Code AHK handoff workflow

This file records the working AutoHotkey v2 logic validated with Jean-Paul for the ChatGPT ↔ Claude Code screenshot handoff test.

It complements `AI_CHATGPT.md`. It is mainly a ChatGPT-facing memory/reference file so future chats remember the precise automation logic, screen positions, and the reason why the answer may be `j'ai pas trouvé`.

## 1. Purpose

The test checks whether ChatGPT can receive a screenshot of Claude Code output, analyze it, and answer whether a generated response contains both markers:

```text
DEBUT PROMPT
FIN PROMPT
```

The expected automated reply is:

```text
j'ai trouvé
```

only if both markers are found in the relevant copied text after the last image handoff message.

Otherwise, the expected reply is:

```text
j'ai pas trouvé
```

This is normal and can be the correct result when Claude Code's screenshot/return does not contain the expected marker block.

## 2. Important validated behavior

A previous false positive occurred because `Ctrl+A` / `Ctrl+C` can copy the whole ChatGPT page, including older messages and even previous script snippets that contain the literal strings `DEBUT PROMPT` and `FIN PROMPT`.

Therefore the script must not search the whole clipboard blindly.

Correct rule:

```text
Search only the copied text located after the last occurrence of:
voici le retour de Claude Code
```

If the markers are before that last handoff message, they are historical noise and must be ignored.

## 3. Validated workflow

End-to-end AHK test flow:

```text
1. Select/activate the Claude Code terminal/window.
2. Take a screenshot of Claude Code with Alt+PrintScreen.
3. Activate the ChatGPT window in the LLM_TEST project.
4. Click only on the LLM_TEST "new chat" button.
5. Click the new-chat input area, which is different from the normal chat input area.
6. Paste the screenshot into the new-chat input.
7. Wait 5 seconds for the image to attach.
8. Type: voici le retour de Claude Code
9. Send the message.
10. Watch the ChatGPT visual area and wait until it is stable for at least 5 seconds.
11. Click the validated copy-focus point before doing Ctrl+A.
12. Press Ctrl+A then Ctrl+C.
13. Search only after the last "voici le retour de Claude Code" marker.
14. If both DEBUT PROMPT and FIN PROMPT are found: answer "j'ai trouvé".
15. Otherwise answer "j'ai pas trouvé".
16. Send that answer in the standard chat input area.
```

## 4. Validated coordinates from Jean-Paul's environment

These coordinates were validated on Jean-Paul's current Chrome/ChatGPT layout. They may need recalibration if resolution, scaling, browser layout, sidebar state, or window placement changes.

Window Spy reference showed Chrome/ChatGPT roughly as:

```text
ChatGPT - LLM_TEST - Google Chrome
ahk_class Chrome_WidgetWin_1
ahk_exe chrome.exe
Control often observed as Chrome_RenderWidgetHostHWND1 or Intermediate D3D Window1
Active window approx: x=-10 y=0 w=1940 h=2086
Client approx: x=2 y=0 w=1916 h=2074
```

### Coordinates

```ahk
; Button "Nouveau chat" in the LLM_TEST ChatGPT project.
NEW_CHAT_BUTTON_X := 84
NEW_CHAT_BUTTON_Y := 87

; Input zone when a new chat has just been opened.
; This is NOT the same as the standard input in an existing chat.
; Window Spy validated position:
; Screen: 391, 961
NEW_CHAT_INPUT_X := 391
NEW_CHAT_INPUT_Y := 961

; Standard chat input in an already-started chat.
; Used to answer "j'ai trouvé" / "j'ai pas trouvé".
; Window Spy validated position:
; Screen: 784, 1989
CHAT_INPUT_X := 784
CHAT_INPUT_Y := 1989

; Point to click before Ctrl+A / Ctrl+C, so the page/response area is focused correctly.
; Window Spy validated position:
; Screen: 1180, 1384
COPY_FOCUS_X := 1180
COPY_FOCUS_Y := 1384
```

## 5. Visual stability logic

The script must wait for visual stability before copying the response. The validated approach is to watch a broad ChatGPT render area, not only the input/click position.

Recommended watch area:

```ahk
WATCH_X := 20
WATCH_Y := 160
WATCH_W := 1880
WATCH_H := 1750
```

Validated stability settings:

```ahk
STABLE_MS := 5000
POLL_MS := 500
TIMEOUT_MS := 300000
SAMPLE_STEP_X := 80
SAMPLE_STEP_Y := 80
MAX_CHANGED_POINTS := 3
```

The script samples pixels across the watch area, compares snapshots, tolerates a few changed points, and considers ChatGPT ready only after the area remains stable for 5 seconds.

If the test hangs forever, likely causes are cursor blinking, animations, overlays, scrollbars, or too large a watch area. Increase `MAX_CHANGED_POINTS` or shrink the watch region.

If it triggers too early, lower `MAX_CHANGED_POINTS` and/or reduce `SAMPLE_STEP_X/Y`.

## 6. Marker detection rule

Do not use this unsafe logic:

```ahk
foundBegin := InStr(capturedText, BEGIN_MARKER, false) > 0
foundEnd := InStr(capturedText, END_MARKER, false) > 0
foundBoth := foundBegin && foundEnd
```

Use this safer logic instead:

```ahk
searchText := capturedText
lastMsgPos := FindLastOccurrence(capturedText, IMAGE_MESSAGE)

if (lastMsgPos > 0) {
    searchText := SubStr(capturedText, lastMsgPos + StrLen(IMAGE_MESSAGE))
    Log("Search restricted after last IMAGE_MESSAGE at pos=" lastMsgPos)
} else {
    Log("WARNING: IMAGE_MESSAGE not found in copied text; searching full clipboard")
}

foundBegin := InStr(searchText, BEGIN_MARKER, false) > 0
foundEnd := InStr(searchText, END_MARKER, false) > 0
foundBoth := foundBegin && foundEnd
```

Helper:

```ahk
FindLastOccurrence(haystack, needle) {
    lastPos := 0
    startPos := 1

    loop {
        pos := InStr(haystack, needle, false, startPos)

        if (pos = 0) {
            break
        }

        lastPos := pos
        startPos := pos + StrLen(needle)
    }

    return lastPos
}
```

## 7. Why ChatGPT may answer `j'ai pas trouvé`

`j'ai pas trouvé` is not necessarily a failure of the automation.

It is the correct answer when the Claude Code screenshot or the ChatGPT analysis of that screenshot does not include both required markers:

```text
DEBUT PROMPT
FIN PROMPT
```

Example validated case: Claude Code returned a PR summary for Tetris PR #88 with changed files, validation notes, and a manual checklist, but no `DEBUT PROMPT` / `FIN PROMPT` block. In that case the correct response was:

```text
j'ai pas trouvé
```

Later, if the copied page still contains old occurrences of those strings from earlier messages/scripts, the safer post-`IMAGE_MESSAGE` search rule prevents a false `j'ai trouvé`.

## 8. Calibration hotkeys used in the script

Recommended hotkeys:

```text
F6  = show current mouse position for calibration
F7  = test visual stability only
F8  = run full workflow
F9  = test new-chat input click
F10 = test copy-focus click
Esc = quit script
```

## 9. Future-chat reminder for ChatGPT

When Jean-Paul resumes this automation in a new chat:

- remember there are two different ChatGPT input positions:
  - new-chat input: `391,961`;
  - standard existing-chat input: `784,1989`;
- the script must click the LLM_TEST new-chat button first, then paste into the new-chat input;
- after ChatGPT answers, wait for broad visual stability for 5 seconds;
- before copying, click `1180,1384`;
- avoid global clipboard false positives by searching only after the last `voici le retour de Claude Code`;
- `j'ai pas trouvé` is a valid/correct outcome when the screenshot does not contain both markers.
